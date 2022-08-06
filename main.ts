let LIMITED_DISTANCE = -40
let signal = 0
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
//  MAIN
//  ========================================
function handle_street_sign(sign: number) {
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S8, 0)
}

//  ========================================
//  RADIO
//  ========================================
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    let time = radio.receivedPacket(RadioPacketProperty.Time)
    basic.showString(name)
    basic.showString("" + signal)
    if (name == "instruction" && signal <= LIMITED_DISTANCE) {
        handle_street_sign(value)
    }
    
})
//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S8, 0)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 20)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 20)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 20)
    motor.MotorRun(motor.Motors.M4, motor.Dir.CW, 20)
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
})
