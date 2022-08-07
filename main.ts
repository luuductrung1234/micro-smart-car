let LIMITED_DISTANCE = -40
let signal = 0
let currenct_direction = 0
let current_speed = 20
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
        basic.showString("M")
        engine_stop()
    }
    
    if (name == "steps") {
        basic.showString("S")
        
        signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
        sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        time = radio.receivedPacket(RadioPacketProperty.Time)
        basic.showString("" + signal)
        if (signal <= LIMITED_DISTANCE) {
            handle_steps(value)
        }
        
    }
    
    if (name == "is_run") {
        basic.showString("R")
        handle_run(value)
    }
    
    if (name == "direction") {
        basic.showString("D")
        handle_direction(value)
    }
    
    if (name == "speed") {
        basic.showString("S")
        handle_speed(value)
    }
    
})
//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    go_forward(50)
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
})
//  ========================================
//  MAIN
//  ========================================
function handle_steps(sign: number) {
    
}

function handle_direction(direction: number) {
    
    
    if (currenct_direction == direction) {
        return
    }
    
    if (direction == 1) {
        currenct_direction = direction
        turn_left(current_speed)
    }
    
    if (direction == 2) {
        currenct_direction = direction
        turn_right(current_speed)
    }
    
    if (direction == 3) {
        currenct_direction = direction
        go_forward(current_speed)
    }
    
    if (direction == 4) {
        currenct_direction = direction
        go_backward(current_speed)
    }
    
}

function handle_run(is_run: number) {
    
    if (is_run == 0) {
        engine_stop()
    }
    
    if (is_run == 1) {
        go_forward(current_speed)
    }
    
}

function handle_speed(speed: number) {
    
    if (current_speed != speed) {
        current_speed = speed
    }
    
}

function go_forward(speed: number) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
}

function go_backward(speed: number) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speed)
}

function turn_right(speed: number) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CCW, speed)
}

function turn_left(speed: number) {
    engine_stop()
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, speed)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, speed)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, speed)
}

function engine_stop() {
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, 0)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 0)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, 0)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, 0)
}

