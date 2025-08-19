import {
  DATA_CENTER_BITS,
  IdGenerator,
  MACHINE_BITS,
  SEQUENCE_BITS,
  TWITTER_EPOCH,
} from "../src/idGenerator/index.js";

// HELPERS
export const SEQ_MASK = (1n << SEQUENCE_BITS) - 1n;
export const MACHINE_MASK = ((1n << MACHINE_BITS) - 1n) << SEQUENCE_BITS;
export const DC_MASK =
  ((1n << DATA_CENTER_BITS) - 1n) << (SEQUENCE_BITS + MACHINE_BITS);
export const TS_SHIFT = SEQUENCE_BITS + MACHINE_BITS + DATA_CENTER_BITS;

function decodeId(id: bigint) {
  const sequence = id & SEQ_MASK;
  const machineId = (id & MACHINE_MASK) >> SEQUENCE_BITS;
  const dataCenterId = (id & DC_MASK) >> (SEQUENCE_BITS + MACHINE_BITS);
  const timestamp = (id >> TS_SHIFT) + TWITTER_EPOCH;
  return {
    sequence,
    machineId,
    dataCenterId,
    timestampMs: timestamp,
    timestampDate: new Date(Number(timestamp)),
  };
}

function bitLength(x: bigint): number {
  return x.toString(2).length;
}

describe("Test Id Generator", () => {
  it("provides 64 bits bigint ID", () => {
    const idGenerator = new IdGenerator();
    const id = idGenerator.getId();

    expect(typeof id).toBe("bigint");
    expect(bitLength(id)).toBeLessThanOrEqual(64);
  });

  it("throws on out-of-range DC/machine", () => {
    const maxDataCenter = Number((1n << DATA_CENTER_BITS) - 1n);
    const maxMachine = Number((1n << MACHINE_BITS) - 1n);
    expect(() => new IdGenerator(-1, 0)).toThrow();
    expect(() => new IdGenerator(maxDataCenter + 1, 0)).toThrow();
    expect(() => new IdGenerator(0, -1)).toThrow();
    expect(() => new IdGenerator(0, maxMachine + 1)).toThrow();
  });

  it("decodes back to the same fields", () => {
    const gen = new IdGenerator(3, 7);
    const id = gen.getId();
    const decodedId = decodeId(id);

    expect(Number(decodedId.dataCenterId)).toBe(3);
    expect(Number(decodedId.machineId)).toBe(7);
    expect(Number(decodedId.sequence)).toBe(0);

    // timestamp sanity: close to Date.now()
    const now = Date.now();
    const ts = Number(decodedId.timestampMs);
    expect(now).lessThanOrEqual(ts);
    expect(Math.abs(ts - now)).toBeLessThan(2000); // within 2s
  });

  it("is increasing for sequential calls", () => {
    const gen = new IdGenerator(0, 0);
    const ids = Array.from({ length: 10 }, () => gen.getId());
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i] > ids[i - 1]).toBe(true);
    }
  });

  it("increments sequence within the same millisecond and resets next ms", () => {
    const gen = new IdGenerator(0, 0);
    vi.useFakeTimers();
    const fixed = new Date("2025-08-18T12:00:00.000Z").getTime();
    vi.setSystemTime(fixed);

    // Generate multiple within same ms
    const id1 = gen.getId();
    const id2 = gen.getId();
    const d1 = decodeId(id1);
    const d2 = decodeId(id2);

    expect(Number(d2.sequence)).toBe(Number(d1.sequence) + 1);
    expect(Number(d1.timestampMs)).toBe(fixed);
    expect(Number(d2.timestampMs)).toBe(fixed);

    // Next millisecond → sequence should reset to 0
    vi.setSystemTime(fixed + 1);
    const id3 = gen.getId();
    const d3 = decodeId(id3);
    expect(Number(d3.sequence)).toBe(0);
    expect(Number(d3.timestampMs)).toBe(fixed + 1);

    vi.useRealTimers();
  });

  it("handles sequence overflow by moving to the next millisecond", () => {
    const gen = new IdGenerator(0, 0);
    vi.useFakeTimers();
    const fixed = new Date("2025-08-18T12:00:00.000Z").getTime();
    vi.setSystemTime(fixed);

    const maxSeq = Number((1n << SEQUENCE_BITS) - 1n);

    // Generate IDs so that the last one lands on sequence == maxSeq
    for (let i = 0; i <= maxSeq; i++) {
      gen.getId(); // all within the same ms
    }

    // Move time forward BEFORE the next call (so we don't enter the busy-wait)
    vi.setSystemTime(fixed + 1);

    // Next ID should reset sequence to 0 at the new millisecond
    const next = decodeId(gen.getId());
    expect(Number(next.sequence)).toBe(0);
    expect(Number(next.timestampMs)).toBe(fixed + 1);

    vi.useRealTimers();
  });
});
