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

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String ownerID = dbO.getString("ownerID");
                    int emojiID = dbO.getInt("emojiID");
                    int emojiRating = dbO.getInt("emojiRating");
                    String description = dbO.getString("description");

                    System.err.println("Adding new record " +
                        "[owner=" + ownerID + ", " +
                        "emojiID=" + emojiID + " " +
                        "emojiRating=" + emojiRating + " " +
                        "description=" + description + ']');
                    return emojiController.addNewEmojiRecord(ownerID, emojiID, emojiRating, description).toString();
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
