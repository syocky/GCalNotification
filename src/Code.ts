class Line {
  lineToken: string;

  constructor(lineToken: string) {
    this.lineToken = lineToken;
  }

  /**
   * Googleカレンダー予定をLineへ通知する
   *
   * @param calIds GoogleカレンダーIDの配列
   *  省略した場合は全カレンダーを対象にする
   * @param targetDate 指定日
   *  省略した場合は実行した日とする
   */
  notify(calIds?: string[], targetDate?: Date) {
    calIds = calIds || [];
    targetDate = targetDate || new Date();

    let calendars: GoogleAppsScript.Calendar.Calendar[] = [];
    if (calIds.length > 0) {
      for (const calId of calIds) {
        const calendar = CalendarApp.getCalendarById(calId);
        if (calendar != null) {
          calendars.push(CalendarApp.getCalendarById(calId));
        }
      }
    } else {
      // GoogleカレンダーID未指定の場合は全カレンダーを対象とする
      calendars = CalendarApp.getAllCalendars();
    }
    if (calendars.length == 0) {
      // 有効なカレンダーがない場合は処理しない
      return;
    }

    const calMsgs: NotifyCalendarMessage[] = [];
    for (const calendar of calendars) {
      const events = calendar.getEventsForDay(targetDate);

      // 通知メッセージ（カレンダー）を生成
      calMsgs.push(new NotifyCalendarMessage(calendar.getName(), events));
    }

    // 通知メッセージを生成
    const msg = new NotifyMessage(targetDate, calMsgs);

    // LINEへ通知
    const apiOpt: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      payload: 'message=' + msg.getMessage(),
      headers: {
        Authorization: 'Bearer ' + this.lineToken,
      },
    };
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', apiOpt);
  }
}

class NotifyMessage {
  targetDate: Date;
  calendarMsgs: NotifyCalendarMessage[];

  constructor(targetDate: Date, calendarMsgs: NotifyCalendarMessage[]) {
    this.targetDate = targetDate;
    this.calendarMsgs = calendarMsgs;
  }

  getMessage(): string {
    let message: string =
      Utilities.formatDate(this.targetDate, 'JST', 'yyyy/MM/dd') + '\n';
    for (const calendarMsg of this.calendarMsgs) {
      message += calendarMsg.getMessage();
    }
    return message;
  }
}

class NotifyCalendarMessage {
  calendarName: string;
  events: GoogleAppsScript.Calendar.CalendarEvent[];

  constructor(
    calendarName: string,
    events: GoogleAppsScript.Calendar.CalendarEvent[]
  ) {
    this.calendarName = calendarName;
    this.events = events;
  }
  getMessage(): string {
    let message: string = '◆ ' + this.calendarName + '\n';
    if (this.events.length == 0) {
      message += '予定なし' + '\n';
    }
    for (const event of this.events) {
      if (event.isAllDayEvent()) {
        message += '終日';
      } else {
        message +=
          Utilities.formatDate(event.getStartTime(), 'JST', 'HH:mm') +
          ' - ' +
          Utilities.formatDate(event.getEndTime(), 'JST', 'HH:mm');
      }
      message += ' ' + event.getTitle() + '\n';
    }
    message += '\n';
    return message;
  }
}
