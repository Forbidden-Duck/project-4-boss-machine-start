const checkMillionDollarIdea = (req, res, next) => {
    const idea = req.newIdea || req.idea || req.body;
    if (!idea) {
        return res.status(400).send("Invalid idea provided");
    }

    if ((!idea.numWeeks || isNaN(idea.numWeeks) ||
        (!idea.weeklyRevenue || isNaN(idea.weeklyRevenue)))) {
        return res.status(400).send("Invalid idea data provided");
    }

    const totalRevenue = parseInt(idea.numWeeks) * parseInt(idea.weeklyRevenue);
    if (totalRevenue < 1000000) {
        return res.status(400).send("Not a million dollar idea");
    }

    next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
