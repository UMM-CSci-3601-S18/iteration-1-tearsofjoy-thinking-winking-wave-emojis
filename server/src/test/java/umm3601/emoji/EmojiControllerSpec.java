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
                "                    emoji: \"1\",\n" +
                "                    rating: 1,\n" +
                "                    description: \"I'm a little happy!\"" +
                                "}"));
        testEmojis.add(Document.parse("{\n" +
            "                    emoji: \"2\",\n" +
            "                    rating: 5,\n" +
            "                    description: \"I'm very disappointed!\"" +
            "}"));
        testEmojis.add(Document.parse("{\n" +
            "                    emoji: \"3\",\n" +
            "                    rating: 5,\n" +
            "                    description: \"I'm very sick!\"" +
            "}"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("emoji", 4)
                .append("rating", 1)
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

    private static String getEmoji(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("emoji")).getValue();
    }

    @Test
    public void getAllEmojis() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = emojiController.getEmojis(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 emojis", 4, docs.size());
        List<String> emojis = docs
                .stream()
                .map(EmojiControllerSpec::getEmoji)
                .sorted()
                .collect(Collectors.toList());
        List<String> expectedEmoji = Arrays.asList("1", "2", "3", "4");
        assertEquals("Emojis should match", expectedEmoji, emojis);
    }

    @Test
    public void getEmojisWhoAreHappy() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("emoji", new String[] { "1" });
        String jsonResult = emojiController.getEmojis(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 emojis", 1, docs.size());
        List<String> emojis = docs
                .stream()
                .map(EmojiControllerSpec::getEmoji)
                .sorted()
                .collect(Collectors.toList());
        List<String> expectedEmoji = Arrays.asList("1");
        assertEquals("Emojis should match", expectedEmoji, emojis);
    }

}
