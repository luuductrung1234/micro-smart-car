let LIMITED_DISTANCE = -40
let signal = 0
let current_is_run = 0
let current_direction = 3
let current_speed = 30
let current_location = ""
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(2208061444)
}

//  Car
basic.forever(function on_forever() {
    basic.showString("1")
})
//  ========================================
//  RADIO
//  ========================================
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    let sender: number;
    let time: number;
    if (name == "mode") {
        engine_stop()
        basic.showString("0")
    }
    
    if (name == "steps") {
        
        signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
        sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        time = radio.receivedPacket(RadioPacketProperty.Time)
        basic.showString("" + signal)
        if (signal <= LIMITED_DISTANCE) {
            handle_steps(value)
        }
        
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
    
    if (name == "END") {
        engine_stop()
    }
    
})
// l,3,r,2,l,3,r,2
radio.onReceivedString(function on_received_string(decoded_path: string) {
    
    basic.showString("b")
    current_location = decoded_path
    handle_location(current_location)
})
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

function handle_location(curret_location: string) {
    let forward_time: number;
    
    
    
    current_speed = 30
    let location_array = _py.py_string_split(current_location, ",")
    basic.showString("a")
    for (let i of location_array) {
        if (i == "l") {
            current_direction = 1
            engine_run(current_direction, current_speed)
            basic.pause(1000)
        } else if (i == "r") {
            current_direction = 2
            engine_run(current_direction, current_speed)
            basic.pause(1000)
        } else {
            forward_time = parseInt(i)
            current_direction = 3
            engine_run(current_direction, current_speed)
            basic.pause(forward_time * 1000)
        }
        
    }
    basic.pause(100)
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

function go_forward(speed: number) {
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

function turn_right(speed: number) {
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
}

function turn_left(speed: number) {
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
}

function engine_stop() {
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, 0)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 0)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, 0)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, 0)
    
}

