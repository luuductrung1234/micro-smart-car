let current_is_run = 0
let current_direction = 3
let current_speed = 30
let current_steps = [""]
let finished_steps = [""]
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(2208061444)
}

basic.forever(function on_forever() {
    basic.showString("C")
    //  Car
    continue_delivery()
})
//  ========================================
//  RADIO
//  ========================================
radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString.indexOf("start:") >= 0) {
        start_delivery(_py.py_string_split(receivedString, ":")[1])
    }
    
    if (receivedString.indexOf("answer:") >= 0) {
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
    
    current_steps = _py.py_string_split(path, ",")
    
}

function update_delivery(old_step: string, new_path: string) {
    
    if (current_steps.indexOf(old_step) < 0) {
        return
    }
    
    let new_steps = _py.py_string_split(new_path, ",")
    current_steps = new_steps.concat(current_steps)
    
}

function continue_delivery() {
    
    
    
    let finished_indexes = []
    let index = 0
    for (let step of current_steps) {
        if (_py.py_string_isnumeric(step)) {
            go_forward(current_speed, parseInt(step))
            finished_steps.push(step)
            finished_indexes.push(index)
        } else if (step == "r") {
            turn_right(current_speed, 45)
            finished_steps.push(step)
            finished_indexes.push(index)
        } else if (step == "l") {
            turn_left(current_speed, 45)
            finished_steps.push(step)
            finished_indexes.push(index)
        } else {
            radio.sendString("request:" + step)
            break
        }
        
        index += 1
    }
    for (let finished_index of finished_indexes) {
        current_steps.removeAt(finished_index)
    }
    
}

//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    
    
    current_is_run = 1
    current_speed = 40
    let expected_direction = 0
    if (current_direction == 4) {
        expected_direction = 1
    } else {
        expected_direction = current_direction + 1
    }
    
    handle_direction(expected_direction)
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    
    
    current_is_run = 0
    current_speed = 40
    current_direction = 1
    engine_stop()
    
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
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
    basic.showLeds(`
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
    `)
    if (length > 0) {
        basic.pause(length * 100)
    }
    
}

function go_backward(speed: number) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speed)
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
    `)
}

function turn_right(speed: number, angle: number = null) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed + 30)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed + 30)
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    `)
    if (angle !== null) {
        basic.pause(angle * 10)
    }
    
}

function turn_left(speed: number, angle: number = null) {
    engine_stop()
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed + 30)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed + 30)
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
    `)
    if (angle !== null) {
        basic.pause(angle * 10)
    }
    
}

function engine_stop() {
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, 0)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 0)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, 0)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, 0)
    
}

