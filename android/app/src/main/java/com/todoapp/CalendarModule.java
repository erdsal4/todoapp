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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.time.Instant;
import java.time.ZoneId;


public class CalendarModule extends ReactContextBaseJavaModule {
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_INSERT_EVENT = "E_FAILED_TO_INSERT_EVENT";
    private static final String E_FAILED_TO_EDIT_EVENT = "E_FAILED_TO_EDIT_EVENT";
    private static final int WEEKLY_VIEW_REQUEST = 1;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener(){
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == WEEKLY_VIEW_REQUEST) {
                int todoId = intent.getIntExtra("todoId", -1);
                Log.d("CalendarModule", "weekly view pressed on todo with id " + todoId);
                if (mCalendarPromise != null) {
                    mCalendarPromise.resolve(todoId);
                    mCalendarPromise = null;
                }
            }
        }
    };

    private Promise mCalendarPromise;
    private Instant mTimestamp;
    private Activity mCurrentActivity;
    private String mTodoTitle;
    private String mTodoDesc;
    private String mTodoDate;
    private String mTodoComp;

    CalendarModule(ReactApplicationContext context) {

        super(context);
        context.addActivityEventListener(mActivityEventListener);

    }

    @Override
    public String getName() {
        return "CalendarModule";
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void editCalendarEvent(ReadableMap todo, String action, final Promise promise) {
        mTodoTitle = todo.getString("title");
        mTodoDesc = todo.getString("description");
        mTodoDate = todo.getString("due");
        mTodoComp = todo.getBoolean("completed") ? " completed: true" : "";

        if(mTodoTitle == null | mTodoDesc == null | mTodoDate == null) {
            promise.reject("required attribute is null", "title or description or date is null");
        }

        try {
            mTimestamp = Instant.parse(mTodoDate);
        } catch (Exception e) {
            Log.e("CalendarModule", e.getMessage());
            promise.reject("date not parsable", "due date cannot be parsed");
        }

        mCurrentActivity = getCurrentActivity();
        if (mCurrentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        mCalendarPromise = promise;
        switch (action){
            case "insert":
                Log.d("CalendarModule", "Create event called with name: " + mTodoTitle
                        + " and description: " + mTodoDesc + " on " + mTimestamp.atZone(ZoneId.systemDefault()));
                try {
                    long eventID = insertEvent();
                    mCalendarPromise.resolve((double) eventID);
                } catch (Exception e) {
                    mCalendarPromise.reject(E_FAILED_TO_INSERT_EVENT, e);
                }
                break;
            case "edit":
                mTodoDesc = mTodoDesc.split("completed",1)[0];
                double eventId = todo.getDouble("eventId");
                try {
                    int rows = editEvent(eventId);
                    mCalendarPromise.resolve("Rows updated: " + rows);
                } catch (Exception e) {
                    mCalendarPromise.reject(E_FAILED_TO_EDIT_EVENT, e);
                }
                break;
        }
        mCalendarPromise = null;
    }

    @ReactMethod
    public void showWeeklyView(ReadableArray sections, final Promise promise){
        DataManager.getInstance().clearInstance();
        DataManager.getInstance().writeSections(sections);
        Log.i("CALENDAR_MODULE", sections.toString());
        Activity currentActivity = getCurrentActivity();
        Intent intent = new Intent(currentActivity, TodoListActivity.class);
        mCalendarPromise = promise;
        currentActivity.startActivityForResult(intent,WEEKLY_VIEW_REQUEST);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private int editEvent(double eventId) {
        Uri uri = ContentUris.withAppendedId(CalendarContract.Events.CONTENT_URI, (long) eventId);
        ContentResolver cr = mCurrentActivity.getContentResolver();
        ContentValues values = new ContentValues();
        values.put(CalendarContract.Events.DTSTART, mTimestamp.toEpochMilli());
        values.put(CalendarContract.Events.DTEND, mTimestamp.toEpochMilli());
        values.put(CalendarContract.Events.TITLE, mTodoTitle);
        values.put(CalendarContract.Events.DESCRIPTION, mTodoDesc + mTodoComp);
        return cr.update(uri, values, null, null);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private long insertEvent() {
        ContentResolver cr = mCurrentActivity.getContentResolver();
        long calId = CalendarUtility.getDefaultCalendarId(cr);
        Log.d("CalendarModule", String.valueOf(calId));
        ContentValues values = new ContentValues();
        values.put(CalendarContract.Events.DTSTART, mTimestamp.toEpochMilli());
        values.put(CalendarContract.Events.DTEND, mTimestamp.toEpochMilli());
        values.put(CalendarContract.Events.TITLE, mTodoTitle);
        values.put(CalendarContract.Events.DESCRIPTION, mTodoDesc);
        values.put(CalendarContract.Events.CALENDAR_ID, calId);
        values.put(CalendarContract.Events.EVENT_TIMEZONE, ZoneId.systemDefault().getId());
        Uri uri = cr.insert(CalendarContract.Events.CONTENT_URI, values);
        return Long.parseLong(uri.getLastPathSegment());
    }

    }


