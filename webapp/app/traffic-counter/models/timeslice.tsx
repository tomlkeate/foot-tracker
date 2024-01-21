import mongoose, { Schema } from 'mongoose';

const Timeslice = mongoose.model('timeslices', new Schema({
    time: {
        type: Date,
        required: [true, "Current time is required"]
    },
    people: {
        type: Number,
        requried: [true, "people is required"]
    },
    lidar1CurrentUpdateFrequency: {
        type: Number,
        required: [true, "lidar1AverageUpdateFrequency is required"]
    },
    lidar2CurrentUpdateFrequency: {
        type: Number,
        required: [true, "lidar2AverageUpdateFrequency is required"]
    },
    lidar1CurrentTemperature: {
        type: Number,
        required: [true, "lidar1CurrentTemperature is required"]
    },
    lidar2CurrentTemperature: {
        type: Number,
        required: [true, "lidar2CurrentTemperature is required"]
    },
    lidar1TargetDistance: {
        type: Number,
        required: [true, "lidar2TargetDistance is required"]
    },
    lidar2TargetDistance: {
        type: Number,
        required: [true, "lidar2TargetDistance is required"]
    },
    lidar1CurrentDistance: {
        type: Number,
        required: [true, "lidar1CurrentDistance is required"]
    },
    lidar2CurrentDistance: {
        type: Number,
        required: [true, "lidar2CurrentDistance is required"]
    },
    lidar1CurrentStrength: {
        type: Number,
        required: [true, "lidar1CurrentStrength is required"]
    },
    lidar2CurrentStrength: {
        type: Number,
        required: [true, "lidar2CurrentStrength is required"]
    }
}));

export default Timeslice;