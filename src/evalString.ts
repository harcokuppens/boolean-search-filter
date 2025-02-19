

export function evalString(match: string, line: string): boolean {
    const pos = line?.toLowerCase().indexOf(match.toLowerCase()) ?? -1;
    let foundMatch = false;
    if (pos > -1) {
        foundMatch = true;
    }
    return foundMatch;
}


