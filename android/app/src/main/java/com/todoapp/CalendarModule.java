package com.todoapp;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.CalendarContract;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;


public class CalendarModule extends ReactContextBaseJavaModule {
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_INSERT_CANCELLED = "E_INSERT_CANCELLED";
    private static final int CALENDAR_INSERT_REQUEST = 1;
    private static final String E_FAILED_TO_INSERT_EVENT = "E_FAILED_TO_INSERT_EVENT";
    private static final int CALENDAR_EDIT_REQUEST = 2;
    private static final String E_FAILED_TO_EDIT_EVENT = "E_FAILED_TO_EDIT_EVENT";
    private Promise mCalendarPromise;
    private Instant mTimestamp;
    private Activity mCurrentActivity;

    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "CalendarModule";
    }

    public static long getDefaultCalendarId(ContentResolver cr){
        Cursor cursor = cr.query(CalendarContract.Calendars.CONTENT_URI, new String [] {CalendarContract.Calendars._ID,CalendarContract.Calendars.IS_PRIMARY}, CalendarContract.Calendars.IS_PRIMARY + " =1", null, CalendarContract.Calendars._ID);
        cursor.moveToFirst();
        return cursor.getLong(0);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void createCalendarEvent(String title, String description, String date, final Promise promise) {
        ZonedDateTime dueDate = null;
        try {
            Log.d("CalendarModule", "here");
            mTimestamp = Instant.parse(date);
            dueDate = mTimestamp.atZone(ZoneId.systemDefault());;
        } catch (Exception e) {
            Log.e("CalendarModule", e.getMessage());
            promise.reject("date not parsable", "due date cannot be parsed");
        }

        Log.d("CalendarModule", "Create event called with name: " + title
                + " and description: " + description + " on " + dueDate);

        if(title == null | description == null) {
            promise.reject("null title or desc", "title or description is null");
        }

        mCurrentActivity = getCurrentActivity();
        if (mCurrentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        mCalendarPromise = promise;
        try {
            ContentResolver cr = mCurrentActivity.getContentResolver();
            long calId = getDefaultCalendarId(cr);
            Log.d("CalendarModule", String.valueOf(calId));
            ContentValues values = new ContentValues();
            values.put(CalendarContract.Events.DTSTART, mTimestamp.toEpochMilli());
            values.put(CalendarContract.Events.DTEND, mTimestamp.toEpochMilli());
            values.put(CalendarContract.Events.TITLE, title);
            values.put(CalendarContract.Events.DESCRIPTION, description);
            values.put(CalendarContract.Events.CALENDAR_ID, calId);
            values.put(CalendarContract.Events.EVENT_TIMEZONE, ZoneId.systemDefault().getId());
            Uri uri = cr.insert(CalendarContract.Events.CONTENT_URI, values);
            double eventID = (double) Long.parseLong(uri.getLastPathSegment());
            mCalendarPromise.resolve(eventID);
            mCalendarPromise = null;
        } catch (Exception e) {
            mCalendarPromise.reject(E_FAILED_TO_INSERT_EVENT, e);
            mCalendarPromise = null;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void updateCalendarEvent(ReadableMap todo, final Promise promise) {
        double eventId = todo.getDouble("eventId");
        String todoTitle = todo.getString("title");
        String todoDesc = todo.getString("description").split("completed",1)[0];
        String todoDate = todo.getString("due");
        String todoComp = todo.getBoolean("completed") ? " completed: true" : "";

        mTimestamp = Instant.parse(todoDate);
        mCurrentActivity = getCurrentActivity();
        if (mCurrentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }
        // Store the promise to resolve/reject when calendar event returns data
        mCalendarPromise = promise;
        try {
            Uri uri = ContentUris.withAppendedId(CalendarContract.Events.CONTENT_URI, (long) eventId);
            ContentResolver cr = mCurrentActivity.getContentResolver();
            ContentValues values = new ContentValues();
            values.put(CalendarContract.Events.DTSTART, mTimestamp.toEpochMilli());
            values.put(CalendarContract.Events.DTEND, mTimestamp.toEpochMilli());
            values.put(CalendarContract.Events.TITLE, todoTitle);
            values.put(CalendarContract.Events.DESCRIPTION, todoDesc + todoComp);
            int rows = cr.update(uri, values, null, null);
            mCalendarPromise.resolve("Rows updated: " + rows);
            mCalendarPromise = null;
        } catch (Exception e) {
            mCalendarPromise.reject(E_FAILED_TO_EDIT_EVENT, e);
            mCalendarPromise = null;
        }

    }
    }


