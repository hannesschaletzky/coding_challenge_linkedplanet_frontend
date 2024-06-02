import { describe, expect, test } from "@jest/globals";

import {
  extractMatchingDevices,
  filterUsedDevices,
  extractNotMatchingDevices,
  parseDeviceTypeOutputs,
  parseDevices,
  parseConnections,
} from "../IndexController";
import { Connection, Device } from "../Interfaces";

describe("IndexController.ts", () => {
  test("filterUsedDevices", () => {
    // GIVEN
    const connections: Connection[] = [
      {
        id: 1,
        source_device_name: "Stand Mikro groß",
        target_device_name: "Audio-Mischer Regie 1",
      },
      {
        id: 2,
        source_device_name: "Schall 30db",
        target_device_name: "Audio-Mischer Regie 1",
      },
      {
        id: 3,
        source_device_name: "Hauptfeld",
        target_device_name: "Video-Mischer Regie 1",
      },
      {
        id: 4,
        source_device_name: "Video-Mischer Regie 1",
        target_device_name: "Encoder",
      },
      {
        id: 5,
        source_device_name: "Audio-Mischer Regie 1",
        target_device_name: "Encoder",
      },
      {
        id: 6,
        source_device_name: "Encoder",
        target_device_name: "Internet-DAZN",
      },
      {
        id: 7,
        source_device_name: "Encoder",
        target_device_name: "TV-Sky",
      },
      {
        id: 50,
        source_device_name: "Hintertor 1",
        target_device_name: "Video-Mischer Regie 1",
      },
    ];

    const devices: Device[] = [
      { id: 1, name: "Stand Mikro groß", device_type_name: "Mikrofon" },
      { id: 2, name: "Stand Mikro klein", device_type_name: "Mikrofon" },
      { id: 3, name: "Schall 30db", device_type_name: "Mikrofon" },
      { id: 4, name: "Schall 50db", device_type_name: "Mikrofon" },
      { id: 5, name: "Mobiles Mikro rot", device_type_name: "Mikrofon" },
      { id: 6, name: "Mobiles Mikro blau", device_type_name: "Mikrofon" },
      { id: 7, name: "Hauptfeld", device_type_name: "Kamera" },
      { id: 8, name: "Hintertor 1", device_type_name: "Kamera" },
      { id: 9, name: "Hintertor 2", device_type_name: "Kamera" },
      { id: 10, name: "Zeitlupe LO", device_type_name: "Kamera" },
      { id: 11, name: "Zeitlupe RO", device_type_name: "Kamera" },
      {
        id: 12,
        name: "Video-Mischer Regie 1",
        device_type_name: "Video-Mischer",
      },
      {
        id: 13,
        name: "Audio-Mischer Regie 1",
        device_type_name: "Audio-Mischer",
      },
      {
        id: 14,
        name: "Video-Mischer Regie 2",
        device_type_name: "Video-Mischer",
      },
      {
        id: 15,
        name: "Audio-Mischer Regie 2",
        device_type_name: "Audio-Mischer",
      },
      { id: 16, name: "Encoder", device_type_name: "Encoder" },
      { id: 17, name: "Satellit-USA", device_type_name: "Sender-Satellit" },
      {
        id: 18,
        name: "Satellit-USA-Ersatz",
        device_type_name: "Sender-Satellit",
      },
      { id: 19, name: "TV-Sky", device_type_name: "Sender-TV" },
      { id: 20, name: "TV-BBC", device_type_name: "Sender-TV" },
      {
        id: 21,
        name: "Internet-DAZN",
        device_type_name: "Sender-Internet",
      },
      { id: 22, name: "Internet-Sky", device_type_name: "Sender-Internet" },
      { id: 23, name: "Internet-BBC", device_type_name: "Sender-Internet" },
    ];

    // WHEN
    const usedDevices = filterUsedDevices(connections, devices);

    // THEN
    expect(usedDevices.length).toBe(9);
    expect(usedDevices[0].name).toBe("Stand Mikro groß");
    expect(usedDevices[2].name).toBe("Schall 30db");
    expect(usedDevices[8].name).toBe("Hintertor 1");
  });

  test("extractMatchingDevices", () => {
    // GIVEN
    const devices: Device[] = [
      { id: 1, name: "Stand Mikro groß", device_type_name: "Mikrofon" },
      { id: 2, name: "Stand Mikro klein", device_type_name: "Mikrofon" },
      { id: 3, name: "Schall 30db", device_type_name: "Mikrofon" },
      { id: 4, name: "Schall 50db", device_type_name: "Mikrofon" },
    ];

    const usedDevices: Device[] = [
      { id: 1, name: "Stand Mikro groß", device_type_name: "Mikrofon" },
      { id: 4, name: "Schall 50db", device_type_name: "Mikrofon" },
      { id: 9, name: "Hintertor 2", device_type_name: "Kamera" },
    ];

    // WHEN
    const match = extractMatchingDevices(devices, usedDevices);

    // THEN
    expect(match.length).toBe(2);
    expect(match[0].name).toBe("Stand Mikro groß");
    expect(match[1].name).toBe("Schall 50db");
  });

  test("extractNotMatchingDevices", () => {
    // GIVEN
    const devices: Device[] = [
      { id: 1, name: "Stand Mikro groß", device_type_name: "Mikrofon" },
      { id: 2, name: "Stand Mikro klein", device_type_name: "Mikrofon" },
      { id: 3, name: "Schall 30db", device_type_name: "Mikrofon" },
      { id: 4, name: "Schall 50db", device_type_name: "Mikrofon" },
    ];

    const usedDevices: Device[] = [
      { id: 1, name: "Stand Mikro groß", device_type_name: "Mikrofon" },
      { id: 4, name: "Schall 50db", device_type_name: "Mikrofon" },
    ];

    // WHEN
    const idleDevices = extractNotMatchingDevices(devices, usedDevices);

    // THEN
    expect(idleDevices.length).toBe(2);
    expect(idleDevices[0].name).toBe("Stand Mikro klein");
    expect(idleDevices[1].name).toBe("Schall 30db");
  });

  test("parseDeviceTypeOutputs", () => {
    // GIVEN
    const raw = `[{"id":1,"device_type_name":"Mikrofon","output_device_type_name":"Audio-Mischer"}]`;
    const parsedRaw = JSON.parse(raw);

    // WHEN
    const output = parseDeviceTypeOutputs(parsedRaw);

    // THEN
    expect(output.length).toBe(1);
    expect(output[0].id).toBe(1);
    expect(output[0].device_type_name).toBe("Mikrofon");
    expect(output[0].output_device_type_name).toBe("Audio-Mischer");
  });

  test("parseDevices", () => {
    // GIVEN
    const raw = `[{"id":1,"name":"Stand Mikro groß","device_type_name":"Mikrofon"}]`;
    const parsedRaw = JSON.parse(raw);

    // WHEN
    const output = parseDevices(parsedRaw);

    // THEN
    expect(output.length).toBe(1);
    expect(output[0].id).toBe(1);
    expect(output[0].name).toBe("Stand Mikro groß");
    expect(output[0].device_type_name).toBe("Mikrofon");
  });

  test("parseConnections", () => {
    // GIVEN
    const raw = `[{"id":1,"source_device_name":"Stand Mikro groß","target_device_name":"Audio-Mischer Regie 1"}]`;
    const parsedRaw = JSON.parse(raw);

    // WHEN
    const output = parseConnections(parsedRaw);

    // THEN
    expect(output.length).toBe(1);
    expect(output[0].id).toBe(1);
    expect(output[0].source_device_name).toBe("Stand Mikro groß");
    expect(output[0].target_device_name).toBe("Audio-Mischer Regie 1");
  });
});
