export default class Queue {
    constructor() {
        this.head = null
        this.tail = null
        this.size = 0
    }

    enqueue(value) {
        const newNode = new LinkedNode(value, null)
        if (this.head === null) {
            this.head = newNode
            this.tail = newNode
        } else {
            this.tail.nextNode = newNode
            this.tail = newNode
        }
        this.size++
    }

    dequeue() {
        if (this.size === 0) return null;
        if (this.size === 1) {
            this.size--
            const res = this.head
            this.head = null
            this.tail = null
            return res.data
        } else {
            this.size--
            const res = this.head
            this.head = this.head.nextNode
            return res.data
        }
    }

    toString() {
        let res = ""
        let currNode = this.head
        while (currNode !== null) {
            res += currNode.data.toString() + "->"
            currNode = currNode.nextNode
        }
        return res
    }

    isEmpty() {
        return this.size === 0
    }
}

class LinkedNode {
    constructor(data, nextNode) {
        this.data = data
        this.nextNode = nextNode
    }
}

function testQueue() {
    const myList = new Queue()
    myList.enqueue(42)
    console.log(myList.toString())
    myList.enqueue(1)
    console.log(myList.toString())
    myList.enqueue(-2)
    console.log(myList.toString())
    console.log(myList.dequeue())
    console.log(myList.toString())
    console.log(myList.dequeue())
    console.log(myList.toString())
    console.log(myList.dequeue())
    console.log(myList.toString())
    myList.enqueue(42)
    console.log(myList.toString())
}