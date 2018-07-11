package org.apache.cordova.pdf;

import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

/**
 * Created by Administrator on 2018/7/10 0010.
 */

public class ExpertPdfPlugin extends CordovaPlugin {
    private static final String TAG = "ExpertPdfPlugin";
    String pdfPath = "pdf";
    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Log.i(TAG, "execute: ExpertPdfPlugin");

        callbackContext.sendPluginResult(setAndroidPreferences(args));

        return true;
    }
    private PluginResult setAndroidPreferences(JSONArray args) {
        byte[] data = new byte[0];
        try {
            data = Base64.decode(args.getString(0),Base64.DEFAULT);
        } catch (JSONException e) {
            e.printStackTrace();
            return new PluginResult(PluginResult.Status.ERROR);
        }
        for (int i = 0; i < data.length; i++) {
                if(data[i] < 0){
                    //调整异常数据
                    data[i] += 256;
                }
            }
            // 创建String对象保存文件名路径
            final File pdfFile = new File(Environment.getExternalStorageDirectory()+File.separator+pdfPath);
            if (!pdfFile.exists()){
                pdfFile.mkdirs();
            }
            // 创建指定路径的文件
            File file = new File(pdfFile, new Date().getTime()+".png");
            // 获取文件的输出流对象
            FileOutputStream outStream = null;
            try {
                // 如果文件不存在
                if (!file.exists()) {
                    file.createNewFile();
                }
                outStream = new FileOutputStream(file);
                outStream.write(data);
                outStream.flush();
                // 最后关闭文件输出流
                outStream.close();
                if (createPDF(file.getAbsolutePath())){
                    return new PluginResult(PluginResult.Status.OK);
                }else {
                    return new PluginResult(PluginResult.Status.ERROR);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                return new PluginResult(PluginResult.Status.ERROR);
            } catch (IOException e) {
                e.printStackTrace();
                return new PluginResult(PluginResult.Status.ERROR);
            }
    }

    private boolean createPDF(String imgPath) {
        String path = Environment.getExternalStorageDirectory() + File.separator + pdfPath +File.separator+ new Date().getTime()+".pdf";
        try {
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(path));
            Background event = new Background();
            writer.setPageEvent(event);
            document.open();
            document.newPage();
            Image img = Image.getInstance(imgPath);
            img.scaleToFit(PageSize.A4.getWidth() - 30, img.getScaledHeight());
            Log.i("zhufeng", "图片尺寸：(" + img.getScaledWidth() + "," + img.getScaledHeight() + ")");
            Log.i("zhufeng", "页面尺寸：(" + PageSize.A4.getWidth() + "," + PageSize.A4.getHeight() + ")");
            img.setAbsolutePosition((PageSize.A4.getWidth() - img.getScaledWidth()) / 2, (PageSize.A4.getHeight() - img.getScaledHeight())-30);
            document.add(img);
            document.close();
            return true;
        } catch (DocumentException e) {
            e.printStackTrace();
            return false;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        }catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    public class Background extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            //color
            PdfContentByte canvas = writer.getDirectContentUnder();
            Rectangle rect = document.getPageSize();
            canvas.setColorFill(BaseColor.WHITE);
            canvas.rectangle(rect.getLeft(), rect.getBottom(), rect.getWidth(), rect.getHeight());
            canvas.fill();

            //border
            PdfContentByte canvasBorder = writer.getDirectContent();
            Rectangle rectBorder = document.getPageSize();
            rectBorder.setBorder(Rectangle.BOX);
            rectBorder.setBorderWidth(15);
            rectBorder.setBorderColor(BaseColor.WHITE);
            rectBorder.setUseVariableBorders(true);
            canvasBorder.rectangle(rectBorder);
        }
    }

}
