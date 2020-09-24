const express = require('express');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const apiRouter = express.Router();
const minionsRouter = express.Router();
const ideasRouter = express.Router();
const meetingsRouter = express.Router();
const {
    createMeeting,
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    deleteAllFromDatabase,
} = require("./db");

module.exports = { apiRouter, minionsRouter, ideasRouter, meetingsRouter };

/**
 * MINIONS ROUTER
*/

const validateAllMinions = (req, res, next) => {
    const minions = getAllFromDatabase("minions");
    if (!minions) {
        return res.status(404).send("No minions found");
    }
    req.minions = minions;
    next();
};

const validateNewMinion = (req, res, next) => {
    const minion = req.body;
    if (!minion) {
        return res.status(400).send("No minion provided in body");
    }
    if (minion.name == undefined || minion.title == undefined || minion.salary == undefined) {
        return res.status(400).send("Missing minion data");
    }
    req.newMinion = minion;
    next();
};

// "/api/minions"
minionsRouter.get("/", validateAllMinions, (req, res) => {
    res.status(200).send(req.minions);
});
minionsRouter.post("/", validateNewMinion, (req, res) => {
    const newMinion = addToDatabase("minions", req.newMinion);
    res.status(201).send(newMinion);
});

// "/api/minions/:minionId"
minionsRouter.param("minionId", (req, res, next, minionId) => {
    const foundMinion = getFromDatabaseById("minions", minionId);
    if (!foundMinion) {
        res.status(404).send("Minion not found");
    }
    req.minion = foundMinion;
    next();
});
minionsRouter.get("/:minionId", (req, res) => {
    res.status(200).send(req.minion);
});
minionsRouter.put("/:minionId", validateNewMinion, (req, res) => {
    req.minion = req.newMinion;
    updateInstanceInDatabase("minions", req.minion);
    res.status(200).send(req.minion);
});
minionsRouter.delete("/:minionId", (req, res) => {
    deleteFromDatabasebyId("minions", req.minion.id);
    res.status(204).send();
});

/**
 * IDEAS ROUTER
*/

const validateAllIdeas = (req, res, next) => {
    const ideas = getAllFromDatabase("ideas");
    if (!ideas) {
        return res.status(404).send("No ideas found");
    }
    req.ideas = ideas;
    next();
};

const validateNewIdea = (req, res, next) => {
    const idea = req.body;
    if (!idea) {
        return res.status(400).send("No idea provided in body");
    }
    if (idea.name == undefined || idea.numWeeks == undefined || idea.weeklyRevenue == undefined) {
        return res.status(400).send("Missing ideas data");
    }
    req.newIdea = idea;
    next();
};

// "/api/ideas"
ideasRouter.get("/", validateAllIdeas, (req, res) => {
    res.status(200).send(req.ideas);
});
ideasRouter.post("/", validateNewIdea, checkMillionDollarIdea, (req, res) => {
    const newIdea = addToDatabase("ideas", req.newIdea);
    res.status(201).send(newIdea);
});

// "/api/ideas/:ideaId"
ideasRouter.param("ideaId", (req, res, next, ideaId) => {
    const foundIdea = getFromDatabaseById("ideas", ideaId);
    if (!foundIdea) {
        res.status(404).send("Idea not found");
    }
    req.idea = foundIdea;
    next();
});
ideasRouter.get("/:ideaId", (req, res) => {
    res.status(200).send(req.idea);
});
ideasRouter.put("/:ideaId", validateNewIdea, checkMillionDollarIdea, (req, res) => {
    updateInstanceInDatabase("ideas", req.newIdea);
    res.status(200).send(req.newIdea);
});
ideasRouter.delete("/:ideaId", (req, res) => {
    deleteFromDatabasebyId("ideas", req.idea.id);
    res.status(204).send();
});

/**
 * MEETINGS ROUTER
*/

const validateAllMeetings = (req, res, next) => {
    const meetings = getAllFromDatabase("meetings");
    if (!meetings) {
        return res.status(404).send("No meetings found");
    }
    req.meetings = meetings;
    next();
};

// "/api/meetings"
meetingsRouter.get("/", validateAllMeetings, (req, res) => {
    res.status(200).send(req.meetings);
});
meetingsRouter.post("/", (req, res) => {
    const newMeeting = createMeeting();
    addToDatabase("meetings", newMeeting);
    res.status(201).send(newMeeting);
});
meetingsRouter.delete("/", validateAllMeetings, (req, res) => {
    deleteAllFromDatabase("meetings");
    res.status(204).send();
});