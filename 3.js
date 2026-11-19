use movieDB

// Insert documents
db.movies.insertMany([
  {_id:1,title:"Silent River",genre:"Drama",rating:8.4,year:2019,cast:["Asha","Ravi"]},
  {_id:2,title:"Rapid Chase",genre:"Action",rating:7.2,year:2020,cast:["Vikram","Asha"]},
  {_id:3,title:"Lost Letters",genre:"Drama",rating:7.1,year:2018,cast:["Meera","Ravi"]},
  {_id:4,title:"Iron Gate",genre:"Action",rating:8.1,year:2021,cast:["Vikram","Karan"]},
  {_id:5,title:"Morning Song",genre:"Drama",rating:8.8,year:2022,cast:["Meera","Asha"]},
  {_id:6,title:"Laugh Lane",genre:"Comedy",rating:6.9,year:2017,cast:["Karan","Meera"]},
  {_id:7,title:"Night Heist",genre:"Action",rating:6.5,year:2019,cast:["Vikram","Ravi"]},
  {_id:8,title:"Paper Boats",genre:"Drama",rating:7.9,year:2021,cast:["Asha","Karan"]}
])

// 1. Explain without index
db.movies.find({
  genre:"Drama",
  rating:{$gte:8}
}).explain("executionStats")

// 2. Create compound index (good order)
db.movies.createIndex({genre:1,rating:-1})

// 3. Explain using good index
db.movies.find({
  genre:"Drama",
  rating:{$gte:8}
}).explain("executionStats")

// 4. Create poorly ordered index
db.movies.createIndex({rating:1,genre:1})

// 5. Explain using poor index
db.movies.find({
  genre:"Drama",
  rating:{$gte:8}
}).hint("rating_1_genre_1")
.explain("executionStats")

// 6. Drop poorly ordered index
db.movies.dropIndex("rating_1_genre_1")

// 7. Create multikey index
db.movies.createIndex({cast:1})

// Find movies in which Asha acted
db.movies.find({cast:"Asha"})

// 8. Hide compound index
db.runCommand({
  collMod:"movies",
  index:{name:"genre_1_rating_-1",hidden:true}
})

// Explain after hiding index
db.movies.find({
  genre:"Drama",
  rating:{$gte:8}
}).explain("executionStats")

// 9. Unhide compound index
db.runCommand({
  collMod:"movies",
  index:{name:"genre_1_rating_-1",hidden:false}
})

// 10. Create same index with custom name
db.movies.createIndex(
  {genre:1,rating:-1},
  {name:"my_custom_index"}
)

// 11. Display all indexes
db.movies.getIndexes()