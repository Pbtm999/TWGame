export class LeaderBoard {
    constructor() {
        if (typeof(Storage) !== 'undefined') {
            this.ranking = JSON.parse(localStorage.getItem('leaderboardArray'));
            if (this.ranking == null) this.ranking = {};
        }
        
    }

    addLeader(user, size, points) {
        const newLeader = [points, user];
        if (this.ranking[size] === undefined)
            this.ranking[size] = [newLeader];
        else {
            let inserted = false;
            for (let i = 0; i < this.ranking[size].length; i++) {
                if (points > this.ranking[size][i][0]) {
                    this.ranking[size].splice(i, 0, newLeader);
                    inserted = true;
                    break;
                }
            }
    
            if (!inserted) {
                this.ranking[size].push(newLeader);
            }
        }


        if (typeof(Storage) !== 'undefined')
            localStorage.setItem('leaderboardArray', JSON.stringify(this.ranking));
        
    }
}