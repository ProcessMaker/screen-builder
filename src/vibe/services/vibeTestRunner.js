import { load as yamlLoad, dump as yamlDump } from "js-yaml";

export function parseScenarios(content) {
  try {
    const parsed = yamlLoad(content);
    return parsed?.scenarios || [];
  } catch (err) {
    throw new Error(`Invalid YAML: ${err.message}`);
  }
}

export function serializeScenarios(scenarios) {
  return yamlDump({ scenarios }, { indent: 2, lineWidth: 120 });
}

function findByDataCy(root, target) {
  return root.querySelector(`[data-cy="${target}"]`);
}

function getComponentData(vm) {
  if (!vm) return {};
  const data = {};
  if (vm.form) {
    Object.assign(data, vm.form);
  }
  if (vm.$data) {
    Object.keys(vm.$data).forEach((key) => {
      if (typeof vm.$data[key] !== "function" && key !== "submitted") {
        data[key] = vm.$data[key];
      }
    });
  }
  return data;
}

async function runStep(step, root, vm) {
  const el = findByDataCy(root, step.field || step.target);
  if (!el) {
    throw new Error(`Element [data-cy="${step.field || step.target}"] not found`);
  }

  if (step.action === "fill") {
    el.value = step.value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (step.action === "click") {
    el.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function runAssert(assertion, root, vm) {
  if (assertion.assert === "visible") {
    const el = findByDataCy(root, assertion.target);
    if (!el || el.offsetParent === null) {
      throw new Error(`Expected "${assertion.target}" to be visible`);
    }
  } else if (assertion.assert === "data") {
    const data = getComponentData(vm);
    const actual = data[assertion.field];
    if (actual !== assertion.equals) {
      throw new Error(
        `Expected ${assertion.field} to equal "${assertion.equals}", got "${actual}"`
      );
    }
  }
}

export async function runScenario(scenario, previewRoot, previewVm) {
  const result = {
    name: scenario.name,
    passed: false,
    error: null,
  };

  try {
    if (scenario.given?.data && previewVm) {
      Object.entries(scenario.given.data).forEach(([key, value]) => {
        if (previewVm.form && key in previewVm.form) {
          previewVm.form[key] = value;
        }
      });
      await previewVm.$nextTick();
    }

    if (scenario.when) {
      for (const step of scenario.when) {
        await runStep(step, previewRoot, previewVm);
        await previewVm?.$nextTick();
      }
    }

    if (scenario.then) {
      for (const assertion of scenario.then) {
        await runAssert(assertion, previewRoot, previewVm);
      }
    }

    result.passed = true;
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

export async function runAllScenarios(scenarios, previewRoot, previewVm) {
  const results = [];
  for (const scenario of scenarios) {
    results.push(await runScenario(scenario, previewRoot, previewVm));
  }
  return results;
}
