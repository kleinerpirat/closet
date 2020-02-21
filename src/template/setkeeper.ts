interface SetInfo {
    start: number
    end: number
    elements: any,
    innerSets: SetInfo[]
}

const mkSetInfo = (start: number) => ({
    start: start,
    end: 0,
    elements: null,
    innerSets: [],
})

///// Example Usage
// const gen = setKeeper()
// gen.next()
//
// console.log(gen.next(5))
// console.log(gen.next(8))
// console.log(gen.next(-12))
// console.log(gen.next(30))
// console.log(gen.next(-35))
// console.log(gen.next(-55))
//
// gen.next('stop')
export const setKeeper = function*() {
    const setInfos = []

    const getSetInfo = (idxs: number[]) => {
        let reference = setInfos

        for (const id of idxs) {
            reference = reference[id].innerSets
        }

        return reference
    }

    const setStack: number[] = []
    let nextLevel = 0

    while (true) {
        let value = yield setStack

        if (value === 'stop') {
            return setInfos
        }

        else if (value[0] >= 0) /* start */ {
            const startIndex = value[0] - 2 /* two delimiter characters */
            getSetInfo(setStack).push(mkSetInfo(startIndex))
            setStack.push(nextLevel)

            nextLevel = 0
        }

        else /* end */ {
            const endIndex = Math.abs(value[0]) + 2 /* two delimiter characters */
            const poppedLevel = setStack.pop()
            const foundSet = getSetInfo(setStack)[poppedLevel]
            foundSet.end = endIndex
            foundSet.elements = value[1]

            nextLevel = poppedLevel + 1
        }
    }
}
