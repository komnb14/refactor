import {plays} from "./json.js";

class PerformanceCalculator {

    constructor(aPerformance, aplay) {
        this.performance = aPerformance;
        this.play = aplay;
    }

    get amount() {
        throw new Error(`서브클래스에서 처리하도록 설계되었습니다.`);
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30.0);
        return result;
    }
}


class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

export function createStatementData(invoice) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCreadits = totalVolumeCreadits(result)
    return result;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = {...aPerformance};
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function createPerformanceCalculator(aPerformance, aPlay) {
        switch (aPlay.type) {
            case "tragedy" :
                return new TragedyCalculator(aPerformance, aPlay);
            case "comedy" :
                return new ComedyCalculator(aPerformance, aPlay);
        }

    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
    }

    function volumeCreditsFor(aPerformance) {
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
    }

    function totalVolumeCreadits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }
}



