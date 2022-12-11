
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}


class Car {
    constructor(brand, brandKey, model, modelKey, year, amount,statedAmount, automaticAdjustment, commercialUse = false, gnc = false, ) {
        this.brand = brand;
        this.brandKey = brandKey
        this.model = model;
        this.modelKey = modelKey;
        this.year = year;
        this.amount = parseInt(amount);
        this.statedAmount = parseInt(statedAmount);
        this.automaticAdjustment = parseFloat(automaticAdjustment);
        this.gnc = gnc;
        this.commercialUse = commercialUse;
    }
}

class Product {
    constructor(code, name, description, rate) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.rate = rate;
    }
}

class PaymentType {
	constructor(method, installments, discount){
		this.method = method;
		this.installments = installments;
		this.discount = discount;
	}
}

class Quotation {
    constructor(person, car, product, paymentType) {
        this.person = person;
        this.car = car;
        this.product = product;
        this.paymentType = paymentType;
    }

    
    quote() {
        let policy_Prime;
        let total_Prime;
        let Quotation_Result = [];
        let premium;
        this.product.forEach(prod => {
            policy_Prime = policyPrime(prod.rate, this.car.amount, this.car.automaticAdjustment);
            total_Prime = totalPrime(policy_Prime, this.car.gnc, this.car.commercialUse, this.person.age);
            premium = totalPremium(total_Prime, this.paymentType).toFixed(0);
            Quotation_Result.push({
                coverageCode: prod.code,
                name: prod.name,
                description: prod.description,
                premium: Number(premium),
                installments: Number((premium / this.paymentType.installments).toFixed(0)),
            });
        }
        )
        return Quotation_Result;
    }

    
    getProductsStr() {
        return this.product.map(prod => prod.name).toString();
    }
}


const commercialUseDiscount = (price) => price * -0.05;
const commercialDiscount = (price,paymentType) => price * paymentType.discount;
const gncCharge = (price) => price * 0.12;
function ageCharge(age, price) {
    if (age < 27) {
        return price * 0.004;
    } else if (age <= 50) {
        return price * 0.001;
    } else {
        return price * 0.002;
    }
}


function policyPrime(productRate, carAmount, automaticAdjustment = 0.15) {
    const EXPENSES_RATE = 1500; 
    const RC_BASE = 5000; 
    const PRIME_RATE = (carAmount + (carAmount * automaticAdjustment)) * productRate;

    return PRIME_RATE + EXPENSES_RATE + RC_BASE;
}


function totalPrime(policyPrime, gnc, commercialUse, age) {
    let prime = policyPrime;
    if (gnc) {
        prime += gncCharge(policyPrime);
    }
    if (commercialUse) {
        prime += commercialUseDiscount(policyPrime);
    }
    prime += ageCharge(age, policyPrime);

    return prime;
}


function totalPremium(totalPrime, paymentType) {
    const COMPANY_FEE = 0.1;
    const SSN_FEE = 0.02;
    const IVA_FEE = 0.21; 

    let premium = (totalPrime + (totalPrime * COMPANY_FEE));
    premium += premium * SSN_FEE;
    premium += premium * IVA_FEE;

    
    premium += commercialDiscount(premium, paymentType);

    return premium; 
}
