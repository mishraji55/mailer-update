const replacePersonalizationTags = (content, recipientData) => {
  let personalizedContent = content;
  Object.keys(recipientData).forEach((key) => {
    const tag = `{{${key}}}`;
    personalizedContent = personalizedContent.replace(new RegExp(tag, "g"), recipientData[key]);
  });
  return personalizedContent;
};

module.exports = { replacePersonalizationTags };