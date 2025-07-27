const Assert = _ => {
    const errors = [];

    const is = (a, b) => {
        if (a === b) return;
        errors.push(`not equal <div style="color: orange">${a}</div><div>${b}</div>`);
    }

    const are = (a,b) => is(
        JSON.stringify(a, null, 2),
        JSON.stringify(b, null, 2)
    )

    const isTrue = a => is(a,true)
    const isFalse = a => is(a,false)

    const throws = (exp, fn) => {
        let i = 0;
        try {
            fn()
        }catch (ex){
            are(ex, exp)
            i = 1;
        }finally {
            if (i !== 1)
                errors.push(`no exception thrown`);

        }
    }

    return {
        is,
        are,
        isTrue,
        isFalse,
        throws,
        errors
    }
}



const testSuiteCssView = _ => {
    if (document.getElementById("testsuite_css") != null) return;

    const css = document.createElement("link");

    css.setAttribute("id", "testsuite_css");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", "lib/testsuite.css");

    document.getElementsByTagName("html")[0].appendChild(css);
}



const testProjector = (root, test) => {
    root.innerHTML +=`<span>${test.name}</span>` + (test.errors.length === 0?
        '<div style="color: forestgreen">ok</div>':
        `<div style="color: red">${test.errors.join("<br>")}</div>`)
}


const testSuiteProjector = (testSuiteName, tests) => {
        const h1 = document.createElement("h1")
        h1.innerText = testSuiteName;

        const wrapper = document.createElement("div");
        wrapper.appendChild(h1);

        const testsElement = document.createElement("div");
        testsElement.setAttribute("class", "tests");
        tests.forEach(test => testProjector(testsElement, test));

        const testSuiteElement = document.createElement("div");
        testSuiteElement.appendChild(h1);
        testSuiteElement.appendChild(testsElement);

        return testSuiteElement;

};

const render = (testSuiteName, tests) => {

    const root = document.getElementById("testsuite");
    root.appendChild(testSuiteProjector(testSuiteName, tests));

    testSuiteCssView();
}


export const TestSuite = testsuite_name => {

    const tests = [];

    return {
        add: (testName, fn) => {
            tests.push({
                name: testName,
                test: _ => {
                    const assert = Assert();
                    fn(assert);
                    return assert.errors;
                },
            });
        },

        run: _ => {
            const test_results = tests.map(test => {
                console.info("run test " + test.name);

                const errors = test.test();
                return {
                    name: test.name,
                    errors,
                }
            });

            render(testsuite_name, test_results);
        }
    }
}