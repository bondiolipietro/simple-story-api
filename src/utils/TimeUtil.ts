class TimeUtil {
  static getMsFromMinutes(minutes: number): number {
    return minutes * 60 * 1000
  }

  static getMsFromDays(days: number): number {
    return days * 24 * 60 * 60 * 1000
  }
}

export { TimeUtil }
