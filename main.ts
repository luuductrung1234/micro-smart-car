function on_start() {
    basic.showIcon(IconNames.Heart)
}

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
basic.forever(function on_forever() {
    basic.showIcon(IconNames.Happy)
    radio.setGroup(1)
})
