package umm3601.emoji;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about emojis.
=======
import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about users.
>>>>>>> 1958b19ce2e6e7eb7aaaa6bf1572415dcb3f09f0
 */
public class EmojiController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> emojiCollection;

    public EmojiController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        emojiCollection = database.getCollection("emojiRecords");
    }

    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */


    // Will use this for reports
    public String getEmojiRecords(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("age")) {
            int targetAge = Integer.parseInt(queryParams.get("age")[0]);
            filterDoc = filterDoc.append("age", targetAge);
        }

        if (queryParams.containsKey("company")) {
            String targetContent = (queryParams.get("company")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("company", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingEmojiRecords = emojiCollection.find(filterDoc);

        return JSON.serialize(matchingEmojiRecords);
    }

    public String addNewEmojiRecord(String ownerID, int emojiID, int emojiRating, String date, String description) {

        Document newEmoji = new Document();
        newEmoji.append("ownerID", ownerID);
        newEmoji.append("emojiID", emojiID);
        newEmoji.append("emojiRating", emojiRating);
        newEmoji.append("date", date);
        newEmoji.append("description", description);

        try {
            emojiCollection.insertOne(newEmoji);
            ObjectId id = newEmoji.getObjectId("_id");
            System.err.println("Successfully added new emoji [_id=" + id + ", owner=" + ownerID + ", emoji=" + emojiID + ']');
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
