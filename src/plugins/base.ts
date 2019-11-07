export class Plugin {
    draw(array, count: number = 1) {
        return array[Math.floor(Math.random() * array.length)]
    }
}