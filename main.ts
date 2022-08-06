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
    basic.showIcon(IconNames.Asleep)
}

//  ========================================
//  RADIO
//  ========================================
radio.onReceivedValue(function on_received_value(name: string, value: number) {
    
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    let time = radio.receivedPacket(RadioPacketProperty.Time)
    led.plotBarGraph(Math.map(signal, -95, -42, 0, 9), 9)
})
//  ========================================
//  BUTTON
//  ========================================
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    motor.servo(motor.Servos.S1, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.showIcon(IconNames.Square)
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.showIcon(IconNames.SmallSquare)
})
