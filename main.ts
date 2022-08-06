let LIMITED_DISTANCE = -46
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
    motor.servo(motor.Servos.S1, 0)
}

//  ========================================
//  RADIO
//  ========================================
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    let time = radio.receivedPacket(RadioPacketProperty.Time)
    // basic.show_string(str(signal))
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
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
})
