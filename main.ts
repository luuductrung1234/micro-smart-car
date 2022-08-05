input.onButtonPressed(Button.A, function () {
    motor.servo(motor.Servos.S1, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.showIcon(IconNames.Square)
})
input.onButtonPressed(Button.B, function () {
    motor.servo(motor.Servos.S8, 180)
    basic.pause(200)
    motor.servo(motor.Servos.S1, 0)
    basic.showIcon(IconNames.SmallSquare)
})
basic.forever(function () {
    basic.showIcon(IconNames.Happy)
})
