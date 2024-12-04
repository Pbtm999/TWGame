export class LeaderBoard {
    constructor() {
        this.array = [];
    }

    addLeader(points, user) {
        const newLeader = [points, user];

        let inserted = false;
        for (let i = 0; i < this.array.length; i++) {
            if (points > this.array[i][0]) {
                this.array.splice(i, 0, newLeader);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            this.array.push(newLeader);
        }
        
    }
}