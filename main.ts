let LIMITED_DISTANCE = -40
let signal = 0
let current_is_run = 0
let current_direction = 1
let current_speed = 30
//  ========================================
//  BASIC
//  ========================================
function on_start() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(2208061444)
}

//  Car
basic.forever(function on_forever() {
    basic.showString("C")
})
//  ========================================
//  RADIO
//  ========================================
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    let sender: number;
    let time: number;
    if (name == "mode") {
        engine_stop()
        basic.showString("M")
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
        basic.showString("R")
    }
    
    if (name == "direction") {
        handle_direction(value)
        basic.showString("D")
    }
    
    if (name == "speed") {
        handle_speed(value)
        basic.showString("S")
    }
    
})
//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (current_direction == 4) {
        current_direction = 1
    } else {
        current_direction += 1
    }
    
    handle_direction(current_direction)
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    engine_stop()
    
})
//  ========================================
//  MAIN
//  ========================================
function handle_steps(sign: number) {
    
}

function handle_direction(direction: number) {
    
    
    basic.showNumber(direction)
    if (current_is_run == 0 || current_direction == direction) {
        return
    }
    
    engine_run(direction)
}

function handle_run(is_run: number) {
    
    // basic.show_number(is_run)
    if (is_run == 0) {
        engine_stop()
    }
    
    if (is_run == 1) {
        go_forward(current_speed)
    }
    
}

function handle_speed(speed: number) {
    
    
    // basic.show_number(speed)
    if (current_speed == speed) {
        return
    }
    
    current_speed = speed
    engine_run(current_direction)
}

function engine_run(direction: number) {
    
    
    current_direction = direction
    if (current_direction == 1) {
        turn_left(current_speed)
    }
    
    if (current_direction == 2) {
        turn_right(current_speed)
    }
    
    if (current_direction == 3) {
        go_forward(current_speed)
    }
    
    if (current_direction == 4) {
        go_backward(current_speed)
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
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
    `)
}

function turn_left(speed: number) {
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speed)
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

