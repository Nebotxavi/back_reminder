export const TWITTER_EPOCH = 1288834974657n;
export const DATA_CENTER_BITS = 5n;
export const MACHINE_BITS = 5n;
export const SEQUENCE_BITS = 12n;

export class IdGenerator {
  private static readonly EPOCH: bigint = TWITTER_EPOCH;
  private static readonly DATA_CENTER_BITS: bigint = DATA_CENTER_BITS;
  private static readonly MACHINE_BITS: bigint = MACHINE_BITS;
  private static readonly SEQUENCE_BITS: bigint = SEQUENCE_BITS;

  private static readonly MAX_DATA_CENTER_ID =
    (1n << IdGenerator.DATA_CENTER_BITS) - 1n;
  private static readonly MAX_MACHINE_ID =
    (1n << IdGenerator.MACHINE_BITS) - 1n;
  private static readonly MAX_SEQUENCE = (1n << IdGenerator.SEQUENCE_BITS) - 1n;

  private dataCenterId: bigint;
  private machineId: bigint;
  private sequence: bigint = 0n;
  private lastTimestamp: bigint = -1n;

  constructor(dataCenterId: number = 0, machineId: number = 0) {
    if (
      dataCenterId < 0 ||
      dataCenterId > Number(IdGenerator.MAX_DATA_CENTER_ID)
    ) {
      throw new Error("dataCenterId out of range (0~31)");
    }
    if (machineId < 0 || machineId > Number(IdGenerator.MAX_MACHINE_ID)) {
      throw new Error("machineId out of range (0~31)");
    }
    this.dataCenterId = BigInt(dataCenterId);
    this.machineId = BigInt(machineId);
  }

  private currentTime(): bigint {
    return BigInt(Date.now());
  }

  public getId(): bigint {
    let timestamp = this.currentTime();

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & IdGenerator.MAX_SEQUENCE;
      if (this.sequence === 0n) {
        // sequence overflow in this millisecond, wait for next ms
        while (timestamp <= this.lastTimestamp) {
          timestamp = this.currentTime();
        }
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const shiftedTimestamp =
      (timestamp - IdGenerator.EPOCH) <<
      (IdGenerator.DATA_CENTER_BITS +
        IdGenerator.MACHINE_BITS +
        IdGenerator.SEQUENCE_BITS);
    const shiftedDatacenter =
      this.dataCenterId <<
      (IdGenerator.MACHINE_BITS + IdGenerator.SEQUENCE_BITS);
    const shiftedMachine = this.machineId << IdGenerator.SEQUENCE_BITS;

    return (
      shiftedTimestamp | shiftedDatacenter | shiftedMachine | this.sequence
    );
  }
}
