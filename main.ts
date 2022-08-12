let current_is_run = 0
let current_direction = 3
let current_speed = 40
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
    
    go_back_home()
    
}

function go_back_home() {
    
    
    
    if (current_steps.length > 0 || finished_steps.length == 0) {
        return
    }
    
    basic.showString("...")
    basic.pause(5000)
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
    _py.py_array_clear(finished_steps)
    
}

function go_out_spot() {
    
    for (let step of go_out_spot_steps) {
        basic.showString(step)
        if (parseInt(step) > 0) {
            go_forward(current_speed, parseInt(step))
        }
        
        if (parseInt(step) < 0) {
            go_backward(current_speed, parseInt(step))
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
            go_backward(current_speed, parseInt(step))
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
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    
    _py.py_array_clear(current_steps)
    _py.py_array_clear(finished_steps)
    
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    start_delivery("r,l")
    
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

function turn_right(speed: number, angle: number = null) {
    engine_stop()
    rekabit.runMotor(MotorChannel.M2, MotorDirection.Forward, speed)
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    `)
    if (angle !== null) {
        pause(angle * 5)
    }
    
}

function turn_left(speed: number, angle: number = null) {
    engine_stop()
    rekabit.runMotor(MotorChannel.M1, MotorDirection.Forward, speed)
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
    `)
    if (angle !== null) {
        pause(angle * 6)
    }
    
}

function engine_stop() {
    rekabit.brakeMotor(MotorChannel.M1)
    rekabit.brakeMotor(MotorChannel.M2)
    
}

function turn_with_compass(expected_degrees: any) {
    let opposit: number;
    let start_degrees = input.compassHeading()
    let end_degrees = input.compassHeading()
    // basic.show_number(start_degrees)
    // basic.show_icon(IconNames.HAPPY)
    while (true) {
        if (start_degrees <= 90) {
            opposit = start_degrees + 180
            if (end_degrees >= 270 && 360 - end_degrees + start_degrees >= expected_degrees) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees >= 0 && start_degrees - end_degrees >= expected_degrees) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees > opposit && end_degrees < 270) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees <= 180 && end_degrees - start_degrees >= expected_degrees) {
                // basic.show_string("R")
                break
            }
            
            if (end_degrees < opposit && end_degrees > 180) {
                // basic.show_string("R")
                break
            }
            
        } else if (start_degrees <= 180) {
            opposit = start_degrees + 180
            if (start_degrees - end_degrees >= expected_degrees) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees - start_degrees >= expected_degrees) {
                // basic.show_string("R")
                break
            }
            
        } else if (start_degrees <= 270) {
            opposit = start_degrees - 180
            if (start_degrees - end_degrees >= expected_degrees) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees - start_degrees >= expected_degrees) {
                // basic.show_string("R")
                break
            }
            
            if (end_degrees >= 0 && end_degrees <= 90 && end_degrees < opposit) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees >= 0 && end_degrees <= 90 && end_degrees > opposit) {
                // basic.show_string("R")
                break
            }
            
        } else if (start_degrees <= 360) {
            opposit = start_degrees - 180
            if (end_degrees >= 180 && start_degrees - end_degrees >= expected_degrees) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees <= 90 && 360 - start_degrees + end_degrees >= expected_degrees) {
                // basic.show_string("R")
                break
            }
            
            if (end_degrees > opposit && end_degrees < 180) {
                // basic.show_string("L")
                break
            }
            
            if (end_degrees < opposit && end_degrees > 90) {
                // basic.show_string("R")
                break
            }
            
        }
        
        end_degrees = input.compassHeading()
    }
}

