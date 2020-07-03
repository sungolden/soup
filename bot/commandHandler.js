function handleBOTX(text){

    let object = {}
    let textArray = text.trim().split(" ")
    let optionsArray = []
    let argumentArray = []
    let argumentArrayQuoted = []
    let command = textArray.shift()
    let argumentFound = false
    for (let index = 0; index < textArray.length; index++) {
        const element = textArray[index]
        if(!argumentFound){
            if(element.startsWith("--")){
                let option = element.substring(2).split("=")[0]
                let argument = element.substring(2).split("=")[1]
                if(argument){
                    let arg = argument
                    if(arg.startsWith(`"`)){
                        arg = arg.substring(1)
                        let pointer = index+1
                        while(pointer < textArray.length){
                            if(textArray[pointer].endsWith(`"`)) break
                            pointer++
                        }
                        if(pointer < textArray.length){
                            let collected = textArray.slice(index+1, pointer+1).join(" ")
                            arg += " "+collected
                            arg = arg.substring(0,arg.length-1)
                            index = pointer-1
                        }
                    }
                    option += " "+arg
                }
                optionsArray.push(option)
                continue
            }
            if(element.startsWith("-")){
                let flags = element.substring(1).split("=")[0]
                let argument = element.substring(2).split("=")[1]
                for (var i = 0; i < flags.length; i++) {
                    let option = flags[i]
                    if(argument && flags.length == 1){
                        let arg = argument
                        if(arg.startsWith(`"`)){
                            arg = arg.substring(1)
                            let pointer = index+1
                            while(pointer < textArray.length){
                                if(textArray[pointer].endsWith(`"`)) break
                                pointer++
                            }
                            if(pointer < textArray.length){
                                let collected = textArray.slice(index+1, pointer+1).join(" ")
                                arg += " "+collected
                                arg = arg.substring(0,arg.length-1)
                                index = pointer
                            }
                        }
                        option += " "+arg
                    }
                    optionsArray.push(option)
                }
                continue
            }
        }
        argumentFound = true

        if(element.startsWith(`"`)){
            let pointer = index+1
            while(pointer < textArray.length){
                if(textArray[pointer].endsWith(`"`)) break
                pointer++
            }
            if(pointer < textArray.length){
                let collected = textArray.slice(index, pointer+1).join(" ")
                index = pointer
                argumentArray.push(collected.substring(1,collected.length-1))
                argumentArrayQuoted.push(collected)
                continue
            }
        }
        argumentArray.push(element)
        argumentArrayQuoted.push(element)

        
    }
    object.options = optionsArray
    object.string = text
    object.command = command
    object.arguments = argumentArray
    object.argumentsRaw = argumentArrayQuoted

    object.hasOption = hasOption
    object.getOption = getOption

    return object
}

function hasOption(option){
    if(this.options.find(val=>(val.startsWith(option)))) return true;
    return false;
}

function getOption(option){
    return this.options.find(val=>(val.startsWith(option))).substring(option.length) || null
}

module.exports = handleBOTX