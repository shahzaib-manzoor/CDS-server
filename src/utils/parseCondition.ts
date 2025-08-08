function parseCondition(condition:string) {
      // Define a regex pattern to match the format
      const pattern = /(.+?)\s*(>|<|>=|<=|==|!=)\s*(\d+\/\d+)/;
      const match = condition.match(pattern);
    
      if (match) {
        return {
          key: match[1].trim(),
          operator: match[2],
          value: match[3]
        };
      } else {
        throw new Error("Condition format is incorrect");
      }
    } 
    
    export default parseCondition;
 