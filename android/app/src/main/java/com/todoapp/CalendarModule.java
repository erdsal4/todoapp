package com.todoapp;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
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
    private Promise mCalendarPromise;
    private Instant mTimestamp;
    private Activity mCurrentActivity;
    private long mEventId;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == CALENDAR_INSERT_REQUEST) {
                if (mCalendarPromise != null) {
                    long prev_id = getLastEventId(mCurrentActivity.getContentResolver());
                    // if prev_id == mEventId, means there is new events created
                    // and we need to insert new events into local sqlite database.
                    if (prev_id == mEventId) {
                        // do database insert
                        mCalendarPromise.resolve((double) mEventId);
                    } else {
                        mCalendarPromise.reject(E_INSERT_CANCELLED, "Event insert was cancelled");
                    }
                    mCalendarPromise = null;
                }
            }
        }
    };
    CalendarModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "CalendarModule";
    }

    public static long getNewEventId(ContentResolver cr) {
        Cursor cursor = cr.query(CalendarContract.Events.CONTENT_URI, new String [] {"MAX(_id) as max_id"}, null, null, "_id");
        cursor.moveToFirst();
        @SuppressLint("Range") long max_val = cursor.getLong(cursor.getColumnIndex("max_id"));
        return max_val+1;
    }

    public static long getLastEventId(ContentResolver cr) {
        Cursor cursor = cr.query(CalendarContract.Events.CONTENT_URI, new String [] {"MAX(_id) as max_id"}, null, null, "_id");
        cursor.moveToFirst();
        @SuppressLint("Range") long max_val = cursor.getLong(cursor.getColumnIndex("max_id"));
        return max_val;
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
        // Store the promise to resolve/reject when calendar event returns data
        mCalendarPromise = promise;
        try {
            mEventId = getNewEventId(mCurrentActivity.getContentResolver());
            Intent calendarIntent = new Intent(Intent.ACTION_INSERT)
                    .setData(CalendarContract.Events.CONTENT_URI)
                    .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, mTimestamp.toEpochMilli())
                    .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, mTimestamp.toEpochMilli())
                    .putExtra(CalendarContract.Events.TITLE, title)
                    .putExtra(CalendarContract.Events.DESCRIPTION, description);
            mCurrentActivity.startActivityForResult(calendarIntent, CALENDAR_INSERT_REQUEST);
        } catch (Exception e) {
            mCalendarPromise.reject(E_FAILED_TO_INSERT_EVENT, e);
            mCalendarPromise = null;
        }
    }

    @ReactMethod
    public void updateCalendarEvent(ReadableMap todo, Promise promise) {


    }
    }


