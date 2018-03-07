package umm3601.emoji;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.emoji.EmojiController;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

public class EmojiControllerSpec
{
    private EmojiController emojiController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> emojiDocuments = db.getCollection("emojis");
        emojiDocuments.drop();
        List<Document> testEmojis = new ArrayList<>();

/*
        _id: string;
        ownerID: string;
        emoji: number;
        rating: number;
        // mongo should let us store the date in the form <YYYY-mm-ddTHH:MM:ss> as a string
        // for example: "2016-05-18T16:00:00Z" for 4:00pm on the 18th of May 2016
        date: string;
        description: string;
*/

        testEmojis.add(Document.parse("{\n" +
            "                    _id: \"5aa060a983e4f144e78135c2\",\n" +
            "                    date: \"March 8, 2018\",\n" +
            "                    emoji: \"1\",\n" +
            "                    rating: 1,\n" +
            "                    description: \"I'm a little happy!\"" +
            "}"));
        testEmojis.add(Document.parse("{\n" +
            "                    _id: \"5aa060a983e4f144e78135c3\",\n" +
            "                    date: \"March 8, 2018\",\n" +
            "                    emoji: \"2\",\n" +
            "                    rating: 5,\n" +
            "                    description: \"I'm very disappointed!\"" +
            "}"));
        testEmojis.add(Document.parse("{\n" +
            "                    _id: \"5aa060a983e4f144e78135c4\",\n" +
            "                    date: \"March 8, 2018\",\n" +
            "                    emoji: \"3\",\n" +
            "                    rating: 5,\n" +
            "                    description: \"I'm very sick!\"" +
            "}"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("emoji", "4")
                .append("_id", "5aa060a983e4f144e78135c5")
                .append("date", "March 8, 2018")
                .append("rating", "1")
                .append("description", "I'm a little angry!");

        emojiDocuments.insertMany(testEmojis);
        emojiDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        emojiController = new EmojiController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
                = CodecRegistries.fromProviders(Arrays.asList(
                new ValueCodecProvider(),
                new BsonValueCodecProvider(),
                new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String get_id(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("_id")).getValue();
    }

/*
    @Test
    public void getAllEmojis() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = emojiController.getEmojis(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 emojis", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(EmojiControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Chris", "Jamie", "Pat", "Sam");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getEmojisWhoAre37() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("age", new String[] { "37" });
        String jsonResult = emojiController.getEmojis(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 emojis", 2, docs.size());
        List<String> names = docs
            .stream()
            .map(EmojiControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Jamie", "Pat");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getSamById() {
        String jsonResult = emojiController.getEmoji(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", "Sam", sam.get("name"));
        String noJsonResult = emojiController.getEmoji(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }
*/
    @Test
    public void addEmojiTest(){
        String newId = emojiController.addNewEmojiRecord("5aa060a983e4f144e78135c5", "1", "5", "March 8, 2018", "I'm very happy!");

        assertNotNull("Add new emoji should return true when emoji is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("emoji", new String[] { "1" });
        String jsonResult = emojiController.getEmojis(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> _id = docs
            .stream()
            .map(EmojiControllerSpec::get_id)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return _id of new emoji", "5aa060a983e4f144e78135c5", _id.get(0));
    }
/*
    @Test
    public void getEmojiByCompany(){
        Map<String, String[]> argMap = new HashMap<>();
        //Mongo in EmojiController is doing a regex search so can just take a Java Reg. Expression
        //This will search the company starting with an I or an F
        argMap.put("company", new String[] { "[I,F]" });
        String jsonResult = emojiController.getEmojis(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 emojis", 3, docs.size());
        List<String> name = docs
            .stream()
            .map(EmojiControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Jamie","Pat","Sam");
        assertEquals("Names should match", expectedName, name);

    }
*/
}
