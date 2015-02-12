install.packages("rjson")
library("rjson")
json_file = "C:/Users/Barry/Documents/GitHub/NBA_Scraping/test.txt"
json_data <- fromJSON(file = json_file)
json_data <- do.call(rbind, json_data)
height <- json_data[,"height"]
copyHeight<-c()
for (i in 1:length(height)){
copyHeight <-c(copyHeight, height[[i]])}
threesPct <- json_data[,"threesPct"]
copyThreesPct<-c()
for (i in 1:length(threesPct)){
copyThreesPct<-c(copyThreesPct, threesPct[[i]])}

plot(copyHeight, copyThreesPct)
regress<- lm(copyThreesPct~copyHeight)
abline(regress, col="red")
summary(regress)