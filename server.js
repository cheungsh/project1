import express from "express"; 
import path from "path";
 

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(process.cwd(), "public")));

// Route to fetch recipes from Spoonacular
app.get("/api/recipes", async (req, res) => {
  try {
    const { ingredients, diet, number = 10 } = req.query;

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    url.searchParams.set("apiKey", process.env.SPOONACULAR_KEY); // hidden API key
    url.searchParams.set("includeIngredients", ingredients);
    url.searchParams.set("addRecipeInformation", true);
    url.searchParams.set("fillIngredients", true);
    url.searchParams.set("number", number);
    if (diet) url.searchParams.set("diet", diet);

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// Route to fetch individual recipe details
app.get("/api/recipe/:id", async (req, res) => {
  try {
    const url = `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${process.env.SPOONACULAR_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
