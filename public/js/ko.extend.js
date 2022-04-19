// lazy version of computed 
ko.lazy = (calc, ctx) => ko.computed(calc, ctx, { deferEvaluation: true });
