using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Fullstack1.Domain.Entities
{
    public class FileUploadDto
    {
        public IFormFile File { get; set; }
    }
}
