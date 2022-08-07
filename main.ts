let LIMITED_DISTANCE = -40
let signal = 0
let current_is_run = 0
let current_direction = 3
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
    }
    
    if (name == "dir") {
        handle_direction(value)
    }
    
    if (name == "speed") {
        handle_speed(value)
    }
    
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
    current_speed = 40
    current_direction = 1
    engine_stop()
    
})
//  ========================================
//  MAIN
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
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 30)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, 30)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 30)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed + 20)
    motor.servo(motor.Servos.S8, 45)
    basic.pause(100)
    motor.servo(motor.Servos.S8, 90)
    basic.pause(100)
    motor.servo(motor.Servos.S8, 135)
    basic.pause(100)
    motor.servo(motor.Servos.S8, 180)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
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
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 30)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed + 30)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 30)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, 30)
    motor.servo(motor.Servos.S8, 135)
    basic.pause(100)
    motor.servo(motor.Servos.S8, 90)
    basic.pause(100)
    motor.servo(motor.Servos.S8, 45)
    basic.pause(100)
    motor.servo(motor.Servos.S8, 0)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
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

