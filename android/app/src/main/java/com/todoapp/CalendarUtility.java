package com.todoapp;

import android.content.ContentResolver;
import android.database.Cursor;
import android.provider.CalendarContract;

public class CalendarUtility {

    public static long getDefaultCalendarId(ContentResolver cr){
        Cursor cursor = cr.query(CalendarContract.Calendars.CONTENT_URI, new String [] {CalendarContract.Calendars._ID,CalendarContract.Calendars.IS_PRIMARY}, CalendarContract.Calendars.IS_PRIMARY + " =1", null, CalendarContract.Calendars._ID);
        cursor.moveToFirst();
        return cursor.getLong(0);
    }

}
