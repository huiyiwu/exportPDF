package com.my;

import android.app.Application;

/**
 * Created by Administrator on 2018/7/10 0010.
 */

public class App extends Application {
    public static App mAppContext;
    @Override
    public void onCreate() {
        super.onCreate();
        mAppContext = this;
    }
    public static App getmAppContext() {
        return mAppContext;
    }
}
