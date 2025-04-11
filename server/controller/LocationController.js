import Location from "../models/Location.js";
import { getDataFromToken } from "../helper/getDataFromToken.js";
import User from "../models/User.js";
import Country from "../models/CountryModel.js";
import States from "../models/StatesModel.js";
import City from "../models/CityModel.js";

export const getLocation = async (req, res) => {
    try {
        const location = await Location.find();
        return res.json(location);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const getLocationById = async (req, res) => {
    try {
        const { uniqueId } = req.params;
        const location = await Location.find({ uniqueId: uniqueId });
        return res.Location(200).json(location);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const addLocation = async (req, res) => {
    try {
        const { propertyId, address, pincode, city, state } = req.body;

        const location = await Location.findOne({ propertyId });
        if (location) {
            return res.status(400).json({ error: "Location is already exist." });
        }

        const lastLocation = await Location.findOne().sort({ _id: -1 }).limit(1);
        const x = lastLocation ? lastLocation.uniqueId + 1 : 1;

        const userId = await getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUniqueId = user.uniqueId;

        const newLocation = new Location({
            uniqueId: x,
            userId: userUniqueId,
            propertyId,
            address,
            pincode,
            city,
            state
        });
        // console.log(newLocation)
        const savedLocation = await newLocation.save();
        return res.json({ message: "Added Successfully.", savedLocation });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return res.status(400).json({ error: "Location ID is required!" });
        }

        const locationId = await Location.findOne({ uniqueId });
        if (!locationId) {
            return res.status(404).json({ error: "Location not found!" });
        }

        const { address, pincode, city, state } = req.body;

        const updatedLocation = await Location.findOneAndUpdate({ uniqueId }, {
            $set: {
                address,
                pincode,
                city,
                state
            }
        },
            { new: true }
        );

        return res.status(200).json({ message: "Updated successfully.", updatedLocation });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getCountry = async (req, res) => {
    try {
        const country = await Country.find();
        return res.status(200).json(country);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};

export const getStates = async (req, res) => {
    try {
        const states = await States.find();
        return res.status(200).json(states);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};

export const getCity = async (req, res) => {
    try {
        const city = await City.find();
        return res.status(200).json(city);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
};