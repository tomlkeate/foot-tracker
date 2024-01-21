const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));
mongoose.set("strictQuery", false);

const timeSliceSchema = new mongoose.Schema({
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
});

const timeSlice = mongoose.model("timeslice", timeSliceSchema);

const { createBluetooth } = require('node-ble')
const { bluetooth, destroy } = createBluetooth()

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

const MAC_ADDRESS = '7C:9E:BD:46:18:42';

async function discover() {
    const adapter = await bluetooth.defaultAdapter()
    if (! await adapter.isDiscovering())
        await adapter.startDiscovery()
    adapter.devices().then(uuids => {
        uuids.map(uuid => adapter.waitDevice(uuid).then(device => {
            device.getAlias().then(name => {
                console.log('Found device:', name, "\nWith mac address", uuid);
            })
        }))
    })
}

async function connect() {
    const adapter = await bluetooth.defaultAdapter()
    if (! await adapter.isDiscovering())
        await adapter.startDiscovery()
    console.log("Discovering devices...");
    const device = await adapter.waitDevice(MAC_ADDRESS);
    console.log('Found device:', await device.getName());
    console.log('Connecting to device...')
    await device.connect().catch(err => console.log(err))
    console.log('Connected to device')
    const gattServer = await device.gatt().catch(err => console.log(err))
    const service1 = await gattServer.getPrimaryService(SERVICE_UUID)
    const characteristic1 = await service1.getCharacteristic(CHARACTERISTIC_UUID)
    // await characteristic1.writeValue(Buffer.from("Hello world"))
    const timer = ms => new Promise(res => setTimeout(res, ms));
    async function read() {
        while (true) {
            const buffer = await characteristic1.readValue()
            const data = JSON.parse(buffer.toString());
            console.log(data);
            const newTimeSlice = new timeSlice({
                time: new Date(),
                people: data.People,
                lidar1CurrentUpdateFrequency: data['Serial 1']['Ticks since last update'],
                lidar2CurrentUpdateFrequency: data['Serial 2']['Ticks since last update'],
                lidar1CurrentTemperature: data['Serial 1'].Temperature,
                lidar2CurrentTemperature: data['Serial 2'].Temperature,
                lidar1TargetDistance: data['Serial 1']['Target distance'],
                lidar2TargetDistance: data['Serial 2']['Target distance'],
                lidar1CurrentDistance: data['Serial 1'].Distance,
                lidar2CurrentDistance: data['Serial 2'].Distance,
                lidar1CurrentStrength: data['Serial 1'].Strength,
                lidar2CurrentStrength: data['Serial 2'].Strength
            });
            console.log(newTimeSlice);

            newTimeSlice.save().then(
                console.log("Uploaded to MongoDB")
            ).catch((error) => console.log("It is broken", error));
            await timer(1000 * 60 * 5);
        }
    }
    await read();
    await device.disconnect()
    destroy()
}
connect();



