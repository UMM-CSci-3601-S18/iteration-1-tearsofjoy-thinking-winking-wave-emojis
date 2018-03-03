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
 */
public class EmojiController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> emojiCollection;

    /**
     * Construct a controller for emojis.
     *
     * @param database the database containing emoji data
     */
    public EmojiController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        emojiCollection = database.getCollection("emojis");
    }

    /**
     * Helper method that gets a single emoji specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired emoji
     * @return the desired emoji as a JSON object if the emoji with that ID is found,
     * and `null` if no emoji with that ID is found
     */
    public String getEmoji(String id) {
        FindIterable<Document> jsonEmojis
            = emojiCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonEmojis.iterator();
        if (iterator.hasNext()) {
            Document emoji = iterator.next();
            return emoji.toJson();
        } else {
            // We didn't find the desired emoji
            return null;
        }
    }


    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
     * @param queryParams
     * @return an array of Emojis in a JSON formatted string
     */
    public String getEmojis(Map<String, String[]> queryParams) {

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
        FindIterable<Document> matchingEmojis = emojiCollection.find(filterDoc);

        return JSON.serialize(matchingEmojis);
    }


    /**
     * Helper method which appends received emoji information to the to-be added document
     *
     * @param name
     * @param age
     * @param company
     * @param email
     * @return boolean after successfully or unsuccessfully adding a emoji
     */
    public String addNewEmoji(String name, int age, String company, String email) {

        Document newEmoji = new Document();
        newEmoji.append("name", name);
        newEmoji.append("age", age);
        newEmoji.append("company", company);
        newEmoji.append("email", email);

        try {
            emojiCollection.insertOne(newEmoji);
            ObjectId id = newEmoji.getObjectId("_id");
            System.err.println("Successfully added new emoji [_id=" + id + ", name=" + name + ", age=" + age + " company=" + company + " email=" + email + ']');
            // return JSON.serialize(newEmoji);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
