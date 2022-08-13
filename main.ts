let current_is_run = 0
let current_direction = 3
let current_speed = 150
let go_out_spot_steps = ["1", "l"]
let go_in_spot_steps = ["l", "-1"]
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
        basic.showString("a")
        start_delivery(_py.py_string_split(receivedString, ":")[1])
    }
    
    if (receivedString.indexOf("a:") >= 0) {
        basic.showString("b")
        update_delivery(_py.py_string_split(receivedString, ":")[1], _py.py_string_split(receivedString, ":")[2])
    }
    
    
})
//  ========================================
//  DELIVERY
//  ========================================
function start_delivery(path: string) {
    
    current_steps = _py.py_string_split(path, ",")
    go_out_spot()
    
}

function update_delivery(old_step: string, new_path: string) {
    
    if (current_steps.indexOf(old_step) < 0) {
        return
    }
    
    let new_steps = _py.py_string_split(new_path, ",")
    current_steps.removeElement(old_step)
    current_steps = new_steps.concat(current_steps)
    
}

function continue_delivery() {
    
    
    
    let index = 0
    current_steps.removeElement("")
    finished_steps.removeElement("")
    if (current_steps.length == 0) {
        return
    }
    
    for (let step of current_steps) {
        basic.showString(step)
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
            break
        }
        
        engine_stop()
    }
    if (index > 0) {
        current_steps = current_steps.slice(index, current_steps.length)
    }
    
    // go_back_home()
    
}

function go_back_home() {
    
    
    
    if (current_steps.length > 0 || finished_steps.length == 0) {
        return
    }
    
    basic.showString("...")
    basic.showIcon(IconNames.Yes)
    turn_right(current_speed, 90)
    turn_right(current_speed, 90)
    finished_steps.reverse()
    for (let step of finished_steps) {
        basic.showString(step)
        if (parseInt(step) > 0) {
            go_forward(current_speed, parseInt(step))
        } else if (step == "r") {
            turn_left(current_speed, 90)
        } else if (step == "l") {
            turn_right(current_speed, 90)
        }
        
        engine_stop()
    }
    go_in_spot()
    finished_steps = [""]
    
}

function go_out_spot() {
    
    for (let step of go_out_spot_steps) {
        basic.showString(step)
        if (parseInt(step) > 0) {
            go_forward(current_speed, parseInt(step))
        }
        
        if (parseInt(step) < 0) {
            go_backward(current_speed, parseInt(step) * -1)
        } else if (step == "r") {
            turn_right(current_speed, 90)
        } else if (step == "l") {
            turn_left(current_speed, 90)
        }
        
        engine_stop()
    }
    
}

function go_in_spot() {
    
    for (let step of go_in_spot_steps) {
        basic.showString(step)
        if (parseInt(step) > 0) {
            go_forward(current_speed, parseInt(step))
        }
        
        if (parseInt(step) < 0) {
            go_backward(current_speed, parseInt(step) * -1)
        } else if (step == "r") {
            turn_right(current_speed, 90)
        } else if (step == "l") {
            turn_left(current_speed, 90)
        }
        
        engine_stop()
    }
    
}

//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    start_delivery("r,l")
    
})
//  ========================================
//  ENGINE
//  ========================================
function go_forward(speed: number, length: number = 0) {
    engine_stop()
    rekabit.runMotor(MotorChannel.M1, MotorDirection.Forward, speed)
    rekabit.runMotor(MotorChannel.M2, MotorDirection.Forward, speed)
    basic.showLeds(`
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
    `)
    if (length > 0) {
        basic.pause(length * 1500)
    }
    
}

function go_backward(speed: number, length: number = 0) {
    engine_stop()
    rekabit.runMotor(MotorChannel.M1, MotorDirection.Backward, speed)
    rekabit.runMotor(MotorChannel.M2, MotorDirection.Backward, speed)
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
    `)
    if (length > 0) {
        basic.pause(length * 1500)
    }
    
}

function turn_right(speed: number, angle: number) {
    engine_stop()
    rekabit.runMotor(MotorChannel.M2, MotorDirection.Forward, speed)
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    `)
    pause(angle * 10)
}

function turn_left(speed: number, angle: number) {
    engine_stop()
    rekabit.runMotor(MotorChannel.M1, MotorDirection.Forward, speed)
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
    `)
    pause(angle * 10)
}

function engine_stop() {
    rekabit.brakeMotor(MotorChannel.M1)
    rekabit.brakeMotor(MotorChannel.M2)
    
}

