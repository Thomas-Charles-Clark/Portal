using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Portal.UPSShipping
{
    static class Credentials
    {
        public static string userId
        {
            get
            {
                var userId = "";

                using (var conn = new SqlConnection("Data Source=vm-sql1;Initial Catalog=Flock;Integrated Security=True"))
                {
                    if (conn.State != ConnectionState.Open)
                        conn.Open();

                    try
                    {
                        using (var comm = new SqlCommand("SELECT UserID FROM ups.APICredential WHERE APICredentialID = 1", conn))
                        {
                            comm.CommandType = CommandType.Text;

                            var reader = comm.ExecuteReader();

                            while (reader.Read())
                            {
                                userId = reader.GetString(0);
                            }
                        }
                    }
                    finally
                    {
                        conn.Close();
                    }
                }

                return userId;
            }
        }

        public static string password
        {
            get
            {
                var password = "";

                using (var conn = new SqlConnection("Data Source=vm-sql1;Initial Catalog=Flock;Integrated Security=True"))
                {
                    if (conn.State != ConnectionState.Open)
                        conn.Open();

                    try
                    {
                        using (var comm = new SqlCommand("SELECT Password FROM ups.APICredential WHERE APICredentialID = 1", conn))
                        {
                            comm.CommandType = CommandType.Text;

                            var reader = comm.ExecuteReader();

                            while (reader.Read())
                            {
                                password = reader.GetString(0);
                            }
                        }
                    }
                    finally
                    {
                        conn.Close();
                    }
                }

                return password;
            }
        }
    }
}