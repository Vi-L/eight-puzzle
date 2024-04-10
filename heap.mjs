class Heap {
    constructor(comparatorFn) {
        this.heap = []
        this.comparatorFn = comparatorFn
    }
    
    insert(x) {
        const {heap, comparatorFn} = this
        heap.push(x)
        let i = heap.length - 1
        while (true) {
            let parenti = Math.floor(i / 2)
            if (i % 2 == 0) parenti--
            if (i == 0 || !(comparatorFn(heap[i], heap[parenti]))) break;
            [heap[i], heap[parenti]] = [heap[parenti], heap[i]]
            i = parenti
        }
    }

    pop() {
        const {heap, comparatorFn} = this
        if (heap.length === 0) return null
        if (heap.length === 1) {
            return heap.pop()
        }
        const res = heap[0]
        heap[0] = heap.pop()

        let i = 0;
        while (true) {
            const left = 2*i+1
            const right = 2*i+2
            let min = i
            
            if (left < heap.length && comparatorFn(heap[left], heap[min])) {
                min = left
            }
            if (right < heap.length && comparatorFn(heap[right], heap[min])) {
                min = right
            }

            if (min === i) break;
            [heap[i], heap[min]] = [heap[min], heap[i]]
            i = min
        }
        return res
    }

    length() {
        return this.heap.length
    }
}

// let h = new Heap()
// h.insert(100)
// console.log(h.heap)
// h.insert(4)
// console.log(h.heap)
// h.insert(30)
// console.log(h.heap)
// h.insert(17)
// console.log(h.heap)
// h.insert(99)
// console.log(h.heap)

// console.log(h.pop())
// console.log(h.heap)
// console.log(h.pop())
// console.log(h.heap)
// console.log(h.pop())
// console.log(h.heap)

// const arr = [10,18,4,3,15,13,0,12,11,17]
// console.log("Heapsort:",heapsort(arr))
// console.log("Native: ",arr.slice().sort((a,b) => a-b))

// testHeapSort()

function heapsort(arr, comparatorFn) {
    const h = new Heap(comparatorFn)
    for (const element of arr) h.insert(element);
    const res = []
    const len = h.length()
    for (let i = 0; i < len; i++) {
        res.push(h.pop())
    }
    return res;
}

function testHeapSort() { 
    for (let i = 0; i < 100000; i++) {
        const array = []
        const randLen = Math.floor(Math.random() * 100)
        for (let j = 0; j < randLen; j++) {
            array.push(Math.floor(Math.random() * 5000 - 2500))
        }
        if ( heapsort(array).toString() !== array.slice().sort((a,b) => a-b).toString() ) {
            console.log("Original: " + array)
            console.log("Heapsort: " + heapsort(array))
            console.log("JS sort: " + array.slice().sort((a,b) => a-b))
            console.log("Length: " + randLen)
            console.log("----------------")
            return false
        }
    }
    console.log("yay!")
    return true
}

export default Heap

// const arrOfObj = [{value: 5, priority: 22}, {value: 9, priority: 6}, {value: -1, priority: 8}]
// console.log(heapsort(arrOfObj, (a,b) => a.priority < b.priority))