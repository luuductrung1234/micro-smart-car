let current_is_run = 0
let current_direction = 3
let current_speed = 100
let go_out_spot_steps = "1,l,"
let current_steps = [""]
let finished_steps = [""]
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(2208061444)
}

on_start()
basic.forever(function on_forever() {
    basic.showString("C")
    //  Car
    continue_delivery()
})
//  ========================================
//  RADIO
//  ========================================
radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString.indexOf("s:") >= 0) {
        start_delivery(_py.py_string_split(receivedString, ":")[1])
    }
    
    if (receivedString.indexOf("a:") >= 0) {
        update_delivery(_py.py_string_split(receivedString, ":")[1], _py.py_string_split(receivedString, ":")[2])
    }
    
    
})
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    if (name == "mode") {
        engine_stop()
        basic.showString("M")
    }
    
    if (name == "steps") {
        basic.showString("S")
    }
    
    if (name == "is_run") {
        handle_run(value)
    }
    
    if (name == "dir") {
        handle_direction(value)
    }
    
    if (name == "speed") {
        handle_speed(value)
    }
    
})
//  ========================================
//  DELIVERY
//  ========================================
function start_delivery(path: string) {
    
    
    path = go_out_spot_steps + path
    // basic.show_string(path)
    current_steps = _py.py_string_split(path, ",")
    finished_steps = []
    basic.showIcon(IconNames.Yes)
    
}

function update_delivery(old_step: string, new_path: string) {
    
    if (current_steps.indexOf(old_step) < 0) {
        return
    }
    
    let new_steps = _py.py_string_split(new_path, ",")
    current_steps.removeElement(old_step)
    current_steps = new_steps.concat(current_steps)
    basic.showIcon(IconNames.Yes)
    
}

function continue_delivery() {
    
    
    
    let index = 0
    if (current_steps.length == 0) {
        return
    }
    
    current_steps.removeElement("")
    finished_steps.removeElement("")
    for (let step of current_steps) {
        basic.pause(1500)
        if (parseInt(step) > 0) {
            go_forward(current_speed, parseInt(step))
            finished_steps.push(step)
            index += 1
        } else if (step == "r") {
            turn_right(current_speed, 90)
            finished_steps.push(step)
            index += 1
        } else if (step == "l") {
            turn_left(current_speed, 90)
            finished_steps.push(step)
            index += 1
        } else {
            radio.sendString("r:" + step)
            pause(1000)
            break
        }
        
        engine_stop()
    }
    if (index > current_steps.length) {
        current_steps = []
    }
    
    if (index > 0) {
        current_steps = current_steps.slice(index, current_steps.length)
    }
    
    go_back_home()
    
}

function go_back_home() {
    
    
    
    if (current_steps.length > 0 || finished_steps.length == 0) {
        return
    }
    
    basic.showString("...")
    basic.pause(5000)
    basic.showIcon(IconNames.Yes)
    prepare_path_go_home()
    turn_right(current_speed, 175)
    for (let step of finished_steps) {
        basic.pause(1500)
        if (parseInt(step) > 0) {
            go_forward(current_speed, parseInt(step))
        }
        
        if (parseInt(step) < 0) {
            go_backward(current_speed, parseInt(step) * -1)
        } else if (step == "r") {
            turn_left(current_speed, 90)
        } else if (step == "l") {
            turn_right(current_speed, 90)
        }
        
        engine_stop()
    }
    finished_steps = []
    radio.sendString("f:")
    
}

function prepare_path_go_home() {
    
    finished_steps = _py.slice(finished_steps, null, null, -1)
    _py.py_array_pop(finished_steps, finished_steps.length - 1)
    _py.py_array_pop(finished_steps, finished_steps.length - 1)
    finished_steps.push("r")
    finished_steps.push("-1")
}

//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    
    current_steps = [""]
    finished_steps = [""]
    
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    start_delivery("2,l,2,r,2,u2")
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    update_delivery("u2", "r,2,l")
    
})
//  ========================================
//  HANDLER
//  ========================================
function handle_steps(sign: number) {
    
}

function handle_direction(direction: number) {
    
    
    
    if (current_direction != direction) {
        current_direction = direction
    } else {
        return
    }
    
    if (current_is_run == 0) {
        return
    }
    
    engine_run(current_direction, current_speed)
}

function handle_run(is_run: number) {
    
    
    
    // basic.show_number(is_run)
    if (is_run == 0) {
        current_is_run = 0
        engine_stop()
    }
    
    if (is_run == 1) {
        current_is_run = 1
        go_forward(current_speed)
    }
    
}

function handle_speed(speed: number) {
    
    
    
    // basic.show_number(speed)
    if (current_speed == speed) {
        return
    }
    
    current_speed = speed
    engine_run(current_direction, current_speed)
}

//  ========================================
//  ENGINE
//  ========================================
function engine_run(direction: number, speed: number) {
    if (direction == 1) {
        turn_left(speed)
    }
    
    if (direction == 2) {
        turn_right(speed)
    }
    
    if (direction == 3) {
        go_forward(speed)
    }
    
    if (direction == 4) {
        go_backward(speed)
    }
    
}

function go_forward(speed: number, length: number = 0) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
    if (length > 0) {
        basic.pause(length * 900)
    }
    
    engine_stop()
}

function go_backward(speed: number, length: number = 0) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
    if (length > 0) {
        basic.pause(length * 900)
    }
    
    engine_stop()
}

function turn_right(speed: number, angle: number = null) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed + 60)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed + 60)
    if (angle !== null) {
        pause(angle * 5.99)
    }
    
    engine_stop()
}

function turn_left(speed: number, angle: number = null) {
    engine_stop()
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed + 60)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed + 60)
    if (angle !== null) {
        pause(angle * 5.99)
    }
    
    engine_stop()
}

function engine_stop() {
    motor.motorStop(motor.Motors.M1)
    motor.motorStop(motor.Motors.M2)
    
}

