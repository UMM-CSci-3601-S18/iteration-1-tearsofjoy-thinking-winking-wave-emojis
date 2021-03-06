package umm3601.emoji;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

/**
 * Created by Brian on 11/29/2017.
 */
public class EmojiRequestHandler {

    private final EmojiController emojiController;
    public EmojiRequestHandler(EmojiController emojiController){
        this.emojiController = emojiController;
    }

    public String getEmojiRecords(Request req, Response res)
    {
        res.type("application/json");
        return emojiController.getEmojiRecords(req.queryMap().toMap());
    }

    public String addNewEmojiRecord(Request req, Response res)
    {

        System.out.println("It got into addNewEmojiRecord()");
        System.out.println("It got this request: " + req);
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String ownerID = dbO.getString("ownerID");
                    String emoji = dbO.getString("emoji");
                    String rating = dbO.getString("rating");
                    String date = dbO.getString("date");
                    String description = dbO.getString("description");

                    System.out.println("Adding new record " +
                        "[owner =" + ownerID + ", " +
                        "emoji =" + emoji + " " +
                        "rating =" + rating + " " +
                        "date =" + date + " " +
                        "description =" + description + ']');
                    return emojiController.addNewEmojiRecord(ownerID, emoji, rating, date, description).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new emoji record request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
